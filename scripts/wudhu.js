document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const prevButton = document.getElementById('prevStep');
    const nextButton = document.getElementById('nextStep');
    const stepIndicator = document.getElementById('stepIndicator');
    const steps = document.querySelectorAll('.step-card');
    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize buttons state
    updateNavigationButtons();

    // Event Listeners
    prevButton.addEventListener('click', showPreviousStep);
    nextButton.addEventListener('click', showNextStep);

    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            showNextStep();
        } else if (event.key === 'ArrowLeft') {
            showPreviousStep();
        }
    });

    // Functions
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
            step.classList.remove('sliding-left');
            step.classList.remove('sliding-right');
        });

        // Show the current step
        const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            // Add sliding animation based on direction
            if (stepNumber > currentStep) {
                targetStep.classList.add('sliding-left');
            } else if (stepNumber < currentStep) {
                targetStep.classList.add('sliding-right');
            }
        }

        // Update step indicator
        stepIndicator.textContent = `Langkah ${stepNumber} dari ${totalSteps}`;
        
        // Update current step
        currentStep = stepNumber;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Scroll to top of the step smoothly
        targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showNextStep() {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }

    function showPreviousStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    function updateNavigationButtons() {
        // Disable/enable previous button
        prevButton.disabled = currentStep === 1;
        
        // Disable/enable next button
        nextButton.disabled = currentStep === totalSteps;

        // Add visual feedback
        if (prevButton.disabled) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }

        if (nextButton.disabled) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    }

    // Touch Events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - show previous
                showPreviousStep();
            } else {
                // Swipe left - show next
                showNextStep();
            }
        }
    }

    // Progress tracking
    function updateProgressIndicator() {
        const progress = (currentStep / totalSteps) * 100;
        // Anda bisa menambahkan elemen progress bar jika diinginkan
        // document.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    // Optional: Add progress tracking
    function markStepAsComplete() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('completed');
        }
    }
});








// Menambahkan fungsi toggle untuk hamburger menu
// const hamburger = document.querySelector('.hamburger');
// const navLinks = document.querySelector('.nav-links');

// hamburger.addEventListener('click', () => {
//     navLinks.classList.toggle('active');
//     hamburger.classList.toggle('active');
// });
