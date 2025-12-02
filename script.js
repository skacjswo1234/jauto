// 설문 시작 함수
function startSurvey() {
    // 모든 체크박스가 체크되어 있는지 확인
    const checkboxes = document.querySelectorAll('.consent-item input[type="checkbox"]');
    let allChecked = true;
    
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });
    
    if (!allChecked) {
        alert('모든 동의 항목에 체크해주세요.');
        return;
    }
    
    // 첫 번째 화면 숨기고 두 번째 화면 표시
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'flex';
}

// 옵션 선택 함수
function selectOption(option) {
    // 선택된 옵션 저장 (나중에 사용)
    window.selectedOption = option;
    
    // 선택된 버튼 스타일 변경
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === option) {
            btn.classList.add('selected');
        }
    });
    
    // 3번째 화면으로 이동
    setTimeout(() => {
        document.getElementById('page2').style.display = 'none';
        document.getElementById('page3').style.display = 'flex';
    }, 300);
}

// 3번째 화면으로 이동 함수
function nextToStep3() {
    const carName = document.getElementById('carNameInput').value.trim();
    if (!carName) {
        alert('차량명을 입력해주세요.');
        return;
    }
    window.selectedCarName = carName;
    // 4번째 화면으로 이동
    setTimeout(() => {
        document.getElementById('page3').style.display = 'none';
        document.getElementById('page4').style.display = 'flex';
    }, 300);
}

// 4번째 화면으로 이동 함수
function nextToStep4() {
    const userName = document.getElementById('userNameInput').value.trim();
    if (!userName) {
        alert('성함을 입력해주세요.');
        return;
    }
    window.selectedUserName = userName;
    // 5번째 화면으로 이동
    setTimeout(() => {
        document.getElementById('page4').style.display = 'none';
        document.getElementById('page5').style.display = 'flex';
    }, 300);
}

// 5번째 화면으로 이동 함수
function nextToStep5() {
    const phone2 = document.getElementById('phone2').value.trim();
    const phone3 = document.getElementById('phone3').value.trim();
    
    if (!phone2 || !phone3) {
        alert('연락처를 모두 입력해주세요.');
        return;
    }
    
    const fullPhone = `010-${phone2}-${phone3}`;
    window.selectedPhone = fullPhone;
    
    // 완료 모달 표시
    document.getElementById('page5').style.display = 'none';
    document.getElementById('completionModal').style.display = 'flex';
}

// 첫 화면으로 돌아가기
function goToFirstPage() {
    // 모달 숨기기
    document.getElementById('completionModal').style.display = 'none';
    
    // 모든 다른 화면 숨기기
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page3').style.display = 'none';
    document.getElementById('page4').style.display = 'none';
    document.getElementById('page5').style.display = 'none';
    
    // 첫 번째 화면 표시 (원래 상태로 복원)
    const page1 = document.getElementById('page1');
    page1.style.display = 'block';
    page1.style.textAlign = 'center';
    
    // 모든 입력값 초기화
    if (document.getElementById('carNameInput')) {
        document.getElementById('carNameInput').value = '';
    }
    if (document.getElementById('userNameInput')) {
        document.getElementById('userNameInput').value = '';
    }
    if (document.getElementById('phone2')) {
        document.getElementById('phone2').value = '';
    }
    if (document.getElementById('phone3')) {
        document.getElementById('phone3').value = '';
    }
    
    // 선택된 옵션 초기화
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 체크박스 초기화
    const checkboxes = document.querySelectorAll('.consent-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

// 전화번호 입력 자동 포커스 이동
function moveToNext(current, nextId) {
    if (current.value.length >= 4) {
        document.getElementById(nextId).focus();
    }
}

// 체크박스 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    const consentItems = document.querySelectorAll('.consent-item');
    
    consentItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 보기 버튼 클릭 시에는 체크박스 토글하지 않음
            if (e.target.classList.contains('view-btn')) {
                e.stopPropagation();
                return;
            }
            
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        });
    });
});

