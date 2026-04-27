var currentStep = 1;
var cartItems = [];
var orderSubtotal = 0;
var orderShipping = 0;
var orderDiscount = 0;
var orderTotal = 0;
var appliedCoupon = null;

document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
});

function initCheckout() {
    var savedCart = localStorage.getItem('boaSaudeCart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }

    if (cartItems.length === 0) {
        window.location.href = '../main/index.html';
        return;
    }

    renderOrderSummary();
    setupEventListeners();
    goToStep(1);
}

function setupEventListeners() {
    var btnToStep2 = document.getElementById('btn-to-step-2');
    if (btnToStep2) {
        btnToStep2.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(1)) goToStep(2);
        });
    }

    var btnToStep3 = document.getElementById('btn-to-step-3');
    if (btnToStep3) {
        btnToStep3.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(2)) goToStep(3);
        });
    }

    var btnBackToStep1 = document.getElementById('btn-back-step-1');
    if (btnBackToStep1) {
        btnBackToStep1.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(1);
        });
    }

    var btnBackToStep2 = document.getElementById('btn-back-step-2');
    if (btnBackToStep2) {
        btnBackToStep2.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(2);
        });
    }

    var btnApplyCoupon = document.getElementById('btn-apply-coupon');
    if (btnApplyCoupon) {
        btnApplyCoupon.addEventListener('click', function(e) {
            e.preventDefault();
            applyCoupon();
        });
    }

    var paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    for (var i = 0; i < paymentRadios.length; i++) {
        paymentRadios[i].addEventListener('change', function(e) {
            handlePaymentMethodChange(e.target.value);
        });
    }

    var btnPayMbway = document.getElementById('btn-pay-mbway');
    if (btnPayMbway) {
        btnPayMbway.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(3)) initMBWay();
        });
    }

    var btnPayTransfer = document.getElementById('btn-pay-transfer');
    if (btnPayTransfer) {
        btnPayTransfer.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(3)) handleBankTransfer();
        });
    }

    var forms = document.querySelectorAll('form');
    for (var j = 0; j < forms.length; j++) {
        forms[j].addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
}

function renderOrderSummary() {
    var summaryContainer = document.getElementById('checkout-summary');
    if (!summaryContainer) return;

    orderSubtotal = 0;
    var html = '<ul class="checkout-item-list">';

    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var lineTotal = item.price * item.quantity;
        orderSubtotal += lineTotal;

        html += '<li class="checkout-item">';
        html += '<div class="checkout-item-info">';
        html += '<span class="item-name">' + item.name + '</span>';
        html += '<span class="item-qty">x' + item.quantity + '</span>';
        html += '</div>';
        html += '<div class="checkout-item-price">€' + lineTotal.toFixed(2) + '</div>';
        html += '</li>';
    }
    html += '</ul>';

    if (orderSubtotal >= 75) {
        orderShipping = 0;
    } else {
        orderShipping = 4.50;
    }

    if (appliedCoupon === 'BOASAUDE10') {
        orderDiscount = orderSubtotal * 0.10;
    } else {
        orderDiscount = 0;
    }

    orderTotal = orderSubtotal + orderShipping - orderDiscount;

    html += '<div class="checkout-totals">';
    html += '<div class="summary-line"><span>Subtotal:</span><span>€' + orderSubtotal.toFixed(2) + '</span></div>';
    
    if (orderDiscount > 0) {
        html += '<div class="summary-line discount"><span>Desconto (' + appliedCoupon + '):</span><span>-€' + orderDiscount.toFixed(2) + '</span></div>';
    }

    html += '<div class="summary-line"><span>Portes de Envio:</span><span>' + (orderShipping === 0 ? 'Grátis' : '€' + orderShipping.toFixed(2)) + '</span></div>';
    html += '<div class="summary-line grand-total"><span>Total:</span><span>€' + orderTotal.toFixed(2) + '</span></div>';
    html += '</div>';

    summaryContainer.innerHTML = html;

    renderShippingProgressBar();
}

function renderShippingProgressBar() {
    var progressContainer = document.getElementById('shipping-progress-container');
    if (!progressContainer) return;

    if (orderSubtotal >= 75) {
        progressContainer.innerHTML = '<div class="shipping-success">Parabéns! Tem portes grátis.</div>';
    } else {
        var remaining = 75 - orderSubtotal;
        var percentage = (orderSubtotal / 75) * 100;
        var html = '<div class="shipping-progress-text">Faltam €' + remaining.toFixed(2) + ' para portes grátis!</div>';
        html += '<div class="shipping-progress-bar-bg">';
        html += '<div class="shipping-progress-bar-fill" style="width: ' + percentage + '%"></div>';
        html += '</div>';
        progressContainer.innerHTML = html;
    }
}

function goToStep(stepNumber) {
    var sections = document.querySelectorAll('.checkout-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].style.display = 'none';
    }

    var steps = document.querySelectorAll('.checkout-step');
    for (var j = 0; j < steps.length; j++) {
        steps[j].classList.remove('active');
    }

    currentStep = stepNumber;

    var targetSection;
    var targetStepIndicator;

    if (stepNumber === 1) {
        targetSection = document.getElementById('step-dados');
        targetStepIndicator = document.getElementById('indicator-step-1');
    } else if (stepNumber === 2) {
        targetSection = document.getElementById('step-envio');
        targetStepIndicator = document.getElementById('indicator-step-2');
    } else if (stepNumber === 3) {
        targetSection = document.getElementById('step-pagamento');
        targetStepIndicator = document.getElementById('indicator-step-3');
    }

    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
    
    if (targetStepIndicator) {
        targetStepIndicator.classList.add('active');
    }
}

function showError(inputId, message) {
    var inputEl = document.getElementById(inputId);
    if (!inputEl) return;
    
    clearError(inputId);

    var errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.style.color = 'red';
    errorEl.style.fontSize = '0.85em';
    errorEl.style.marginTop = '4px';
    errorEl.id = 'error-' + inputId;
    errorEl.innerText = message;
    
    inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
    inputEl.style.borderColor = 'red';
}

function clearError(inputId) {
    var inputEl = document.getElementById(inputId);
    if (!inputEl) return;
    inputEl.style.borderColor = '';
    
    var existingError = document.getElementById('error-' + inputId);
    if (existingError) {
        existingError.parentNode.removeChild(existingError);
    }
}

function clearAllErrors(stepNumber) {
    var sectionId = '';
    if (stepNumber === 1) sectionId = 'step-dados';
    if (stepNumber === 2) sectionId = 'step-envio';
    if (stepNumber === 3) sectionId = 'step-pagamento';

    var section = document.getElementById(sectionId);
    if (!section) return;

    var errors = section.querySelectorAll('.field-error');
    for (var i = 0; i < errors.length; i++) {
        errors[i].parentNode.removeChild(errors[i]);
    }

    var inputs = section.querySelectorAll('input, select');
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].style.borderColor = '';
    }
}

function validateStep(stepNumber) {
    clearAllErrors(stepNumber);
    var isValid = true;

    if (stepNumber === 1) {
        var email = document.getElementById('checkout-email');
        if (email && (!email.value || email.value.indexOf('@') === -1)) {
            showError('checkout-email', 'Por favor, insira um email válido.');
            isValid = false;
        }

        var nome = document.getElementById('checkout-nome');
        if (nome && (!nome.value || nome.value.trim().length < 2)) {
            showError('checkout-nome', 'O nome deve ter pelo menos 2 caracteres.');
            isValid = false;
        }

        var telefone = document.getElementById('checkout-telefone');
        var phoneRegex = /^[0-9]{9}$/;
        if (telefone && (!telefone.value || !phoneRegex.test(telefone.value.trim()))) {
            showError('checkout-telefone', 'O telefone deve conter 9 dígitos.');
            isValid = false;
        }

        var createAccount = document.getElementById('checkout-create-account');
        if (createAccount && createAccount.checked) {
            var pwd = document.getElementById('checkout-password');
            var pwdConfirm = document.getElementById('checkout-password-confirm');
            
            if (pwd && (!pwd.value || pwd.value.length < 8)) {
                showError('checkout-password', 'A password deve ter pelo menos 8 caracteres.');
                isValid = false;
            }
            if (pwdConfirm && pwd.value !== pwdConfirm.value) {
                showError('checkout-password-confirm', 'As passwords não coincidem.');
                isValid = false;
            }
        }
    } else if (stepNumber === 2) {
        var morada = document.getElementById('checkout-morada');
        if (morada && (!morada.value || morada.value.trim().length === 0)) {
            showError('checkout-morada', 'A morada é obrigatória.');
            isValid = false;
        }

        var cp = document.getElementById('checkout-cp');
        var cpRegex = /^[0-9]{4}-[0-9]{3}$/;
        if (cp && (!cp.value || !cpRegex.test(cp.value.trim()))) {
            showError('checkout-cp', 'Formato inválido (Ex: 1234-567).');
            isValid = false;
        }

        var localidade = document.getElementById('checkout-localidade');
        if (localidade && (!localidade.value || localidade.value.trim().length === 0)) {
            showError('checkout-localidade', 'A localidade é obrigatória.');
            isValid = false;
        }

        var distrito = document.getElementById('checkout-distrito');
        if (distrito && (!distrito.value || distrito.value === '' || distrito.value === 'Selecione...')) {
            showError('checkout-distrito', 'Por favor, selecione um distrito.');
            isValid = false;
        }
    } else if (stepNumber === 3) {
        var terms = document.getElementById('checkout-terms');
        if (terms && !terms.checked) {
            showError('checkout-terms', 'Deve aceitar os termos e condições.');
            isValid = false;
        }

        var paymentMethod = document.querySelector('input[name="payment_method"]:checked');
        if (!paymentMethod) {
            var paymentContainer = document.getElementById('payment-methods-container');
            if (paymentContainer) {
                var err = document.createElement('div');
                err.className = 'field-error checkout-error';
                err.style.color = 'red';
                err.innerText = 'Por favor, selecione um método de pagamento.';
                paymentContainer.appendChild(err);
            }
            isValid = false;
        } else {
            if (paymentMethod.value === 'mbway') {
                var mbwayPhone = document.getElementById('checkout-mbway-phone');
                var phoneRegex2 = /^[0-9]{9}$/;
                if (mbwayPhone && (!mbwayPhone.value || !phoneRegex2.test(mbwayPhone.value.trim()))) {
                    showError('checkout-mbway-phone', 'Insira um número de telemóvel válido (9 dígitos).');
                    isValid = false;
                }
            }
        }
    }

    return isValid;
}

function applyCoupon() {
    var couponInput = document.getElementById('checkout-coupon-code');
    var couponMsg = document.getElementById('coupon-message');
    
    if (!couponInput) return;
    
    var code = couponInput.value.trim().toUpperCase();
    
    if (!couponMsg) {
        couponMsg = document.createElement('div');
        couponMsg.id = 'coupon-message';
        couponMsg.style.marginTop = '10px';
        couponMsg.style.fontSize = '0.9em';
        couponInput.parentNode.appendChild(couponMsg);
    }

    if (code === 'BOASAUDE10') {
        appliedCoupon = code;
        couponMsg.style.color = 'green';
        couponMsg.innerText = 'Cupão aplicado com sucesso! (10% de desconto)';
        renderOrderSummary();
    } else {
        appliedCoupon = null;
        couponMsg.style.color = 'red';
        couponMsg.innerText = 'Cupão inválido ou expirado.';
        renderOrderSummary();
    }
}

function handlePaymentMethodChange(method) {
    var sections = document.querySelectorAll('.payment-details-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }

    if (method === 'paypal') {
        var paypalSec = document.getElementById('section-paypal');
        if (paypalSec) paypalSec.style.display = 'block';
        initPayPal();
    } else if (method === 'mbway') {
        var mbwaySec = document.getElementById('section-mbway');
        if (mbwaySec) mbwaySec.style.display = 'block';
    } else if (method === 'transferencia') {
        var transferSec = document.getElementById('section-transfer');
        if (transferSec) transferSec.style.display = 'block';
    }
}

function initPayPal() {
    var container = document.getElementById('paypal-button-container');
    if (!container) return;

    if (document.getElementById('paypal-sdk')) {
        return;
    }

    container.innerHTML = '<p>A carregar PayPal...</p>';

    var script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=EUR&locale=pt_PT';
    
    script.onload = function() {
        container.innerHTML = '';
        if (window.paypal) {
            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: orderTotal.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        completeOrder('paypal');
                    });
                },
                onError: function(err) {
                    var errDiv = document.createElement('div');
                    errDiv.className = 'field-error checkout-error';
                    errDiv.style.color = 'red';
                    errDiv.innerText = 'Ocorreu um erro ao processar o PayPal. Tente novamente.';
                    container.appendChild(errDiv);
                }
            }).render('#paypal-button-container');
        }
    };
    
    document.body.appendChild(script);
}

function initMBWay() {
    var statusMsg = document.getElementById('mbway-status-message');
    if (!statusMsg) {
        statusMsg = document.createElement('div');
        statusMsg.id = 'mbway-status-message';
        statusMsg.style.marginTop = '15px';
        statusMsg.style.fontWeight = 'bold';
        statusMsg.style.color = '#333';
        var btn = document.getElementById('btn-pay-mbway');
        if (btn) btn.parentNode.appendChild(statusMsg);
    }
    
    statusMsg.innerHTML = 'A aguardar confirmação no seu telemóvel... <span class="spinner">⏳</span>';
    
    var btn = document.getElementById('btn-pay-mbway');
    if (btn) btn.disabled = true;

    setTimeout(function() {
        completeOrder('mbway');
    }, 3000);
}

function handleBankTransfer() {
    var container = document.getElementById('section-transfer');
    if (!container) return;
    
    var infoDiv = document.getElementById('transfer-info-message');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.id = 'transfer-info-message';
        infoDiv.style.marginTop = '15px';
        infoDiv.style.padding = '15px';
        infoDiv.style.backgroundColor = '#f9f9f9';
        infoDiv.style.border = '1px solid #ddd';
        infoDiv.style.borderRadius = '4px';
        container.appendChild(infoDiv);
    }

    var refNum = Math.floor(100000 + Math.random() * 900000);
    
    var html = '<p><strong>IBAN:</strong> PT50 1234 5678 9012 3456 7890 1</p>';
    html += '<p><strong>Referência Encomenda:</strong> EBS-' + refNum + '</p>';
    html += '<p><strong>Valor:</strong> €' + orderTotal.toFixed(2) + '</p>';
    html += '<p style="color: #666; font-size: 0.9em; margin-top: 10px;">Após confirmação do pagamento, a sua encomenda será processada em 24-48h.</p>';
    
    infoDiv.innerHTML = html;

    var btn = document.getElementById('btn-pay-transfer');
    if (btn) btn.disabled = true;

    setTimeout(function() {
        completeOrder('transferencia');
    }, 2500);
}

function completeOrder(paymentMethodStr) {
    var emailEl = document.getElementById('checkout-email');
    var nomeEl = document.getElementById('checkout-nome');
    var telefoneEl = document.getElementById('checkout-telefone');
    var moradaEl = document.getElementById('checkout-morada');
    var cpEl = document.getElementById('checkout-cp');
    var localidadeEl = document.getElementById('checkout-localidade');
    var distritoEl = document.getElementById('checkout-distrito');

    var orderData = {
        orderId: 'EBS-' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        items: cartItems,
        subtotal: orderSubtotal,
        shipping: orderShipping,
        discount: orderDiscount,
        total: orderTotal,
        paymentMethod: paymentMethodStr,
        customer: {
            email: emailEl ? emailEl.value : '',
            nome: nomeEl ? nomeEl.value : '',
            telefone: telefoneEl ? telefoneEl.value : ''
        },
        shippingAddress: {
            morada: moradaEl ? moradaEl.value : '',
            codigoPostal: cpEl ? cpEl.value : '',
            localidade: localidadeEl ? localidadeEl.value : '',
            distrito: distritoEl ? distritoEl.value : ''
        }
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    localStorage.removeItem('boaSaudeCart');

    window.location.href = '../pages/confirmacao.html';
}