document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const successBanner = document.getElementById('success-banner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Simulate API call
                contactForm.style.display = 'none';
                successBanner.style.display = 'block';
                
                // Clear form
                contactForm.reset();
                
                // Optional: scroll to success banner
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Input event to clear errors as user types
    const inputs = ['fullname', 'email', 'phone', 'message'];
    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', () => {
                document.getElementById(`err-${id}`).textContent = '';
            });
        }
    });
});

function validateForm() {
    let isValid = true;

    // Get Fields
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    // Validate Fullname
    if (!fullname) {
        showError('fullname', 'Họ và tên không được để trống.');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Email không được để trống.');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email không đúng định dạng.');
        isValid = false;
    }

    // Validate Phone
    const phoneRegex = /^[0-9+]{10,12}$/; // Simple phone check
    if (!phone) {
        showError('phone', 'Số điện thoại không được để trống.');
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        showError('phone', 'Số điện thoại phải là số (10-12 ký tự).');
        isValid = false;
    }

    // Validate Message
    if (!message) {
        showError('message', 'Vui lòng nhập nội dung tin nhắn.');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Nội dung tin nhắn quá ngắn (tối thiểu 10 ký tự).');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const errEl = document.getElementById(`err-${fieldId}`);
    if (errEl) {
        errEl.textContent = message;
    }
}
