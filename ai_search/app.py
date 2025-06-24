import os
from flask import Flask, request, jsonify, render_template_string
import torch
import torchvision.transforms as transforms
from PIL import Image
import io

app = Flask(__name__)

# --- 1. 모델 로드 (best.pt) ---
# 모델 아키텍처를 정의해야 합니다. (학습 시 사용했던 모델과 동일해야 합니다)
# 예시: ResNet18을 사용했다고 가정합니다.
import torchvision.models as models
# num_classes는 판별할 어종의 수에 맞춰야 합니다 (0:of, 1:kr, 2:rs, 3:bp, 4:rb -> 5개 클래스)
model = models.resnet18(pretrained=False, num_classes=5)

# --- best.pt 파일 경로 설정 ---
# 사용자의 로컬 경로를 반영합니다.
# os.path.join을 사용하여 운영체제에 독립적인 경로를 생성합니다.
MODEL_DIR = r'C:\Users\smhrd\Desktop\GitTestTeam' # Raw 문자열로 백슬래시 문제 방지
model_path = os.path.join(MODEL_DIR, 'best.pt')


# CPU 또는 GPU 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

try:
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval() # 모델을 평가 모드로 전환 (매우 중요!)
    print(f"모델이 {model_path}에서 성공적으로 로드되었습니다.")
except FileNotFoundError:
    print(f"오류: 모델 파일 '{model_path}'을(를) 찾을 수 없습니다. 경로를 확인해주세요.")
    # 모델 파일을 찾을 수 없으면 앱을 실행할 이유가 없으므로 종료합니다.
    exit()
except Exception as e:
    print(f"모델 로드 중 알 수 없는 오류 발생: {e}")
    exit()

# --- 2. 이미지 전처리 함수 (학습 시 사용했던 것과 동일) ---
inference_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# --- 3. 클래스 ID와 어종 이름 매핑 (한국어 이름으로 변경!) ---
class_labels = {
    0: '넙치 (Olive Flounder)',
    1: '볼락 (Korea Rockfish)',
    2: '참돔 (Red Seabream)',
    3: '감성돔 (Black Porgy)',
    4: '돌돔 (Rock Bream)'
}

# --- 4. 어종 판별 함수 ---
def predict_fish_species(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_tensor = inference_transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(image_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            # 가장 높은 확률을 가진 클래스와 그 확률
            conf_score, predicted_class_id = torch.max(probabilities, 1)

        predicted_label_korean = class_labels[predicted_class_id.item()] # 한국어 이름 가져오기
        confidence = conf_score.item()

        # 특정 임계값(예: 70%) 미만이면 '확인할 수 없습니다.' 반환
        confidence_threshold = 0.9 # 70% 미만은 불확실하다고 가정
        if confidence < confidence_threshold:
            return "확인할 수 없습니다."
        else:
            return predicted_label_korean # 한국어 어종 이름 반환

    except Exception as e:
        print(f"이미지 처리 또는 추론 중 오류 발생: {e}")
        return "오류 발생"

# --- 5. Flask 라우트 정의 ---

# 메인 페이지 (index.html 템플릿을 렌더링)
@app.route('/')
def index():
    html_content = """
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>어종 판별</title>
        <style>
            body { font-family: 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif; margin: 20px; background-color: #f4f4f4; text-align: center; color: #333;}
            h1 { color: #0056b3; }
            .drop-area {
                border: 2px dashed #a0a0a0;
                border-radius: 10px;
                padding: 50px;
                margin: 20px auto;
                width: 80%;
                max-width: 500px;
                background-color: #fff;
                cursor: pointer;
                display: flex; /* 내부 요소 중앙 정렬용 */
                justify-content: center; /* 수평 중앙 정렬 */
                align-items: center; /* 수직 중앙 정렬 */
                min-height: 150px; /* 드롭 영역 최소 높이 */
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .drop-area:hover { border-color: #007bff; box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
            .drop-area.highlight { border-color: purple; background-color: #e0e0e0; }
            #imagePreview { max-width: 100%; height: auto; margin-top: 20px; display: none; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);}
            #result { font-size: 2.0em; margin-top: 25px; font-weight: bold; padding: 10px; border-radius: 8px;}
            .camera-button-container { margin-top: 30px; display: none; } /* 모바일에서만 보이도록 기본 숨김 */
            .camera-button {
                background-color: #28a745; /* 녹색 계열 */
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 1.5em;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .camera-button:hover { background-color: #218838; transform: translateY(-2px); }
            .camera-button:active { transform: translateY(0); }
            .camera-button-container p {
                font-size: 0.9em;
                color: #666;
                margin-top: 10px;
            }
            .result-success { color: #28a745; background-color: #e6ffe6; border: 1px solid #28a745; }
            .result-fail { color: #dc3545; background-color: #ffe6e6; border: 1px solid #dc3545; }
            .result-loading { color: #007bff; background-color: #e6f7ff; border: 1px solid #007bff; }
            .result-error { color: #6c757d; background-color: #f8f9fa; border: 1px solid #6c757d; }
        </style>
    </head>
    <body>
        <h1>🐠 어종 판별기</h1>

        <input type="file" id="fileInput" accept="image/*" style="display: none;">

        <div class="drop-area" id="dropArea">
            <p>여기에 이미지를 드래그 앤 드롭하거나<br> 클릭하여 업로드하세요</p>
        </div>

        <div class="camera-button-container" id="cameraButtonContainer">
            <button class="camera-button" id="cameraButton">📸 사진 찍기</button>
            <p>모바일 기기에서 카메라를 사용하여<br> 바로 사진을 찍을 수 있습니다.</p>
        </div>

        <img id="imagePreview" src="#" alt="Image Preview">
        <p id="result"></p>

        <script>
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const resultElement = document.getElementById('result');
    const cameraButtonContainer = document.getElementById('cameraButtonContainer');
    const cameraButton = document.getElementById('cameraButton');

    // --- PC/모바일 구분 (모바일 여부만 체크) ---
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobile()) {
        // 모바일: 드롭 영역은 그대로 두고, 카메라 버튼 컨테이너를 보여줍니다.
        dropArea.style.display = 'block';
        cameraButtonContainer.style.display = 'block';
    } else {
        // PC: 드롭 영역을 보여주고, 카메라 버튼 컨테이너는 숨깁니다.
        dropArea.style.display = 'flex';
        cameraButtonContainer.style.display = 'none';
    }

    // --- 드래그 앤 드롭 이벤트 처리 ---
    dropArea.addEventListener('click', () => fileInput.click()); // 클릭 시 파일 선택창 열기
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('highlight');
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('highlight');
    });
// 드래그 앤 드롭 시
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    const file = e.dataTransfer.files[0]; // <--- 여기 () 없음
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    } else {
        alert('이미지 파일만 드롭할 수 있습니다.');
    }
});

// 파일 선택 시
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]; // <--- 여기 () 없음
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    } else {
        alert('이미지 파일만 선택할 수 있습니다.');
    }
    fileInput.removeAttribute('capture');
});

    // --- 카메라 버튼 클릭 이벤트 처리 (모바일) ---
    cameraButton.addEventListener('click', () => {
        fileInput.setAttribute('capture', 'environment'); // 후면 카메라 우선
        fileInput.click();
    });


    // --- 파일 처리 및 서버 전송 함수 (기존과 동일) ---
    async function handleFile(file) {
        resultElement.textContent = '판별 중...';
        resultElement.className = 'result-loading';

        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.species === "확인할 수 없습니다.") {
                        resultElement.textContent = `🚨 ${data.species}`;
                        resultElement.className = 'result-fail';
                    } else {
                        resultElement.textContent = `✨ 판별 결과: ${data.species}`;
                        resultElement.className = 'result-success';
                    }
                } else {
                    resultElement.textContent = `❌ 오류: ${data.error || '알 수 없는 오류'}`;
                    resultElement.className = 'result-error';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                resultElement.textContent = '❌ 서버 통신 오류 발생';
                resultElement.className = 'result-error';
            }
        };
        reader.readAsDataURL(file);
    }
</script>
    </body>
    </html>
    """
    return render_template_string(html_content)

# 이미지 예측 API 엔드포인트
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': '이미지 파일이 제공되지 않았습니다.'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': '선택된 이미지 파일이 없습니다.'}), 400

    if file:
        image_bytes = file.read()
        species = predict_fish_species(image_bytes)
        return jsonify({'species': species})

    # Flask 앱 실행
if __name__ == '__main__':
    # 로컬 PC에서 모바일 접속을 허용하려면 host='0.0.0.0'으로 설정
    app.run(host='0.0.0.0', port=5000, debug=True)