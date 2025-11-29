// password-validation.js - Add this to your project

class PasswordValidator {
    constructor(options = {}) {
        this.options = {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
            specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            ...options
        };
        
        this.init();
    }

    init() {
        this.createStyles();
        this.setupEventListeners();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .password-info-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                background: #0066ff;
                color: white;
                border-radius: 50%;
                font-size: 12px;
                font-weight: bold;
                cursor: help;
                margin-left: 8px;
                position: relative;
            }

            .password-requirements {
                display: none;
                position: absolute;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                width: 280px;
                font-size: 14px;
                line-height: 1.4;
                top: 100%;
                left: 0;
                margin-top: 5px;
            }

            .password-requirements.show {
                display: block;
            }

            .requirements-title {
                font-weight: 600;
                margin-bottom: 10px;
                color: #333;
                font-size: 14px;
            }

            .requirement-item {
                display: flex;
                align-items: center;
                margin-bottom: 6px;
                color: #666;
            }

            .requirement-item.valid {
                color: #00b894;
            }

            .requirement-item.invalid {
                color: #e74c3c;
            }

            .requirement-icon {
                margin-right: 8px;
                font-size: 12px;
                width: 16px;
                text-align: center;
            }

            .password-strength {
                margin-top: 10px;
                height: 4px;
                background: #eee;
                border-radius: 2px;
                overflow: hidden;
            }

            .strength-bar {
                height: 100%;
                width: 0%;
                transition: all 0.3s ease;
                border-radius: 2px;
            }

            .strength-weak { background: #e74c3c; width: 25%; }
            .strength-fair { background: #f39c12; width: 50%; }
            .strength-good { background: #3498db; width: 75%; }
            .strength-strong { background: #00b894; width: 100%; }

            .strength-text {
                font-size: 12px;
                margin-top: 5px;
                text-align: right;
                color: #666;
            }

            .input-with-validation {
                position: relative;
            }

            .validation-feedback {
                display: none;
                margin-top: 5px;
                font-size: 12px;
            }

            .validation-feedback.valid {
                color: #00b894;
                display: block;
            }

            .validation-feedback.invalid {
                color: #e74c3c;
                display: block;
            }

            @media (max-width: 480px) {
                .password-requirements {
                    width: 250px;
                    left: -50px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.enhancePasswordFields();
        });
    }

    enhancePasswordFields() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            // Skip if already enhanced
            if (input.closest('.input-with-validation')) return;

            this.enhancePasswordField(input);
        });
    }

    enhancePasswordField(passwordInput) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-with-validation';
        
        // Wrap the input
        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);

        // Add info icon
        const infoIcon = this.createInfoIcon();
        wrapper.appendChild(infoIcon);

        // Add validation feedback
        const feedback = this.createValidationFeedback();
        wrapper.appendChild(feedback);

        // Add strength indicator
        const strengthIndicator = this.createStrengthIndicator();
        wrapper.appendChild(strengthIndicator);

        // Add event listeners
        passwordInput.addEventListener('input', (e) => {
            this.validatePassword(e.target.value, feedback, strengthIndicator);
        });

        passwordInput.addEventListener('focus', () => {
            infoIcon.querySelector('.password-requirements').classList.add('show');
        });

        passwordInput.addEventListener('blur', () => {
            // Small delay to allow clicking on requirements
            setTimeout(() => {
                infoIcon.querySelector('.password-requirements').classList.remove('show');
            }, 200);
        });
    }

    createInfoIcon() {
        const icon = document.createElement('div');
        icon.className = 'password-info-icon';
        icon.innerHTML = '?';
        icon.title = 'Password Requirements';

        const requirements = this.createRequirementsList();
        icon.appendChild(requirements);

        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            requirements.classList.toggle('show');
        });

        return icon;
    }

    createRequirementsList() {
        const requirements = document.createElement('div');
        requirements.className = 'password-requirements';

        let requirementsHTML = `
            <div class="requirements-title">Password must contain:</div>
            <div class="requirement-item" data-requirement="length">
                <span class="requirement-icon">•</span>
                At least ${this.options.minLength} characters
            </div>
        `;

        if (this.options.requireUppercase) {
            requirementsHTML += `
                <div class="requirement-item" data-requirement="uppercase">
                    <span class="requirement-icon">•</span>
                    One uppercase letter (A-Z)
                </div>
            `;
        }

        if (this.options.requireLowercase) {
            requirementsHTML += `
                <div class="requirement-item" data-requirement="lowercase">
                    <span class="requirement-icon">•</span>
                    One lowercase letter (a-z)
                </div>
            `;
        }

        if (this.options.requireNumbers) {
            requirementsHTML += `
                <div class="requirement-item" data-requirement="numbers">
                    <span class="requirement-icon">•</span>
                    One number (0-9)
                </div>
            `;
        }

        if (this.options.requireSpecialChars) {
            requirementsHTML += `
                <div class="requirement-item" data-requirement="special">
                    <span class="requirement-icon">•</span>
                    One special character (!@#$% etc.)
                </div>
            `;
        }

        requirements.innerHTML = requirementsHTML;
        return requirements;
    }

    createValidationFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'validation-feedback';
        return feedback;
    }

    createStrengthIndicator() {
        const container = document.createElement('div');
        container.className = 'password-strength-container';
        container.style.display = 'none';

        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength';
        
        const bar = document.createElement('div');
        bar.className = 'strength-bar';
        strengthBar.appendChild(bar);

        const text = document.createElement('div');
        text.className = 'strength-text';

        container.appendChild(strengthBar);
        container.appendChild(text);

        return container;
    }

    validatePassword(password, feedback, strengthContainer) {
        const requirements = this.checkRequirements(password);
        const isValid = requirements.isValid;
        const strength = this.calculateStrength(password);

        // Update requirement items
        Object.keys(requirements.checks).forEach(key => {
            const item = feedback.parentNode.querySelector(`[data-requirement="${key}"]`);
            if (item) {
                item.classList.toggle('valid', requirements.checks[key]);
                item.classList.toggle('invalid', !requirements.checks[key]);
                
                const icon = item.querySelector('.requirement-icon');
                if (icon) {
                    icon.textContent = requirements.checks[key] ? '✓' : '•';
                }
            }
        });

        // Update feedback
        if (password.length === 0) {
            feedback.className = 'validation-feedback';
            feedback.textContent = '';
            strengthContainer.style.display = 'none';
        } else if (isValid) {
            feedback.className = 'validation-feedback valid';
            feedback.textContent = 'Password meets all requirements';
            strengthContainer.style.display = 'block';
        } else {
            feedback.className = 'validation-feedback invalid';
            feedback.textContent = 'Password does not meet all requirements';
            strengthContainer.style.display = 'block';
        }

        // Update strength indicator
        this.updateStrengthIndicator(strength, strengthContainer);
    }

    checkRequirements(password) {
        const checks = {
            length: password.length >= this.options.minLength,
            uppercase: this.options.requireUppercase ? /[A-Z]/.test(password) : true,
            lowercase: this.options.requireLowercase ? /[a-z]/.test(password) : true,
            numbers: this.options.requireNumbers ? /[0-9]/.test(password) : true,
            special: this.options.requireSpecialChars ? 
                new RegExp(`[${this.escapeRegExp(this.options.specialChars)}]`).test(password) : true
        };

        const isValid = Object.values(checks).every(check => check);

        return { isValid, checks };
    }

    calculateStrength(password) {
        let score = 0;
        
        // Length
        if (password.length >= this.options.minLength) score += 1;
        if (password.length >= this.options.minLength + 4) score += 1;
        
        // Character variety
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (this.options.requireSpecialChars && new RegExp(`[${this.escapeRegExp(this.options.specialChars)}]`).test(password)) score += 1;
        
        // Bonus for longer passwords
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        return Math.min(score, 8); // Max score 8 for percentage calculation
    }

    updateStrengthIndicator(strength, container) {
        const bar = container.querySelector('.strength-bar');
        const text = container.querySelector('.strength-text');
        
        const percentage = (strength / 8) * 100;
        
        // Remove existing strength classes
        bar.className = 'strength-bar';
        
        // Add appropriate strength class
        if (percentage < 25) {
            bar.classList.add('strength-weak');
            text.textContent = 'Weak';
        } else if (percentage < 50) {
            bar.classList.add('strength-fair');
            text.textContent = 'Fair';
        } else if (percentage < 75) {
            bar.classList.add('strength-good');
            text.textContent = 'Good';
        } else {
            bar.classList.add('strength-strong');
            text.textContent = 'Strong';
        }
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Method to validate a password manually
    validate(password) {
        return this.checkRequirements(password);
    }

    // Method to get password strength
    getStrength(password) {
        return this.calculateStrength(password);
    }
}

// Initialize the password validator
const passwordValidator = new PasswordValidator({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
});

// Make it available globally
window.PasswordValidator = passwordValidator;