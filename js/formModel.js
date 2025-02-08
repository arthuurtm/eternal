// script.js
document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = document.querySelectorAll('.formStep').length;
  console.log('leght: ', totalSteps)

  const formSteps = Array.from(document.querySelectorAll('.formStep'));
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  const updateStep = (step) => {
      formSteps.forEach((stepElement, index) => {
          stepElement.classList.toggle('active', index === step - 1);
          stepElement.classList.toggle('inactive', index !== currentStep - 1);
      });

      prevButton.style.display = step > 1 ? 'inline-block' : 'none';
      nextButton.textContent = step === totalSteps ? 'Cadastrar' : 'Próximo';
  };

  const validateStep = () => {
      const activeStep = document.querySelector('.formStep.active');
      const inputs = Array.from(activeStep.querySelectorAll('input[required]'));

      for (const input of inputs) {
          if (!input.value.trim()) {
              const errorMessage = document.getElementById(`error-message`);
              const errorText = document.getElementById(`error-text`);
              errorText.textContent = 'Preencha todos os campos obrigatórios.';
              errorMessage.style.display = 'block';
              return false;
          }
      }

      return true;
  };

  nextButton.addEventListener('click', () => {
      if (currentStep === totalSteps) {
          alert('Cadastro concluído!');
          changeSitePage('views/tela_jogos.html', null)
          return;
      }

      if (validateStep()) {
          currentStep++;
          updateStep(currentStep);
      }
  });

  prevButton.addEventListener('click', () => {
      currentStep--;
      updateStep(currentStep);
  });

  updateStep(currentStep);

});
