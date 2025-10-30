/**
 * Utility functions for form-range fill calculation and updates
 */

/**
 * Updates the fill percentage of a form-range container based on its input value
 * @param input - The range input element
 */
export function updateRangeFill(input: HTMLInputElement): void {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const value = parseFloat(input.value);
    const percentage = ((value - min) / (max - min)) * 100;
    
    const container = input.closest('.form-range-container') as HTMLElement;
    if (container) {
        container.style.setProperty('--fill-percentage', `${percentage}%`);
    }
}

/**
 * Initializes all form-range inputs with fill calculation
 * Should be called after DOM content is loaded
 */
export function initializeRangeFills(): void {
    const rangeInputs = document.querySelectorAll('.form-range') as NodeListOf<HTMLInputElement>;
    
    rangeInputs.forEach(input => {
        // Set initial fill
        updateRangeFill(input);
        
        // Add event listeners for real-time updates
        input.addEventListener('input', () => updateRangeFill(input));
        input.addEventListener('change', () => updateRangeFill(input));
    });
}

/**
 * Updates all form-range fills in the document
 * Useful for when values change programmatically (like shuffle)
 */
export function updateAllRangeFills(): void {
    const rangeInputs = document.querySelectorAll('.form-range') as NodeListOf<HTMLInputElement>;
    rangeInputs.forEach(input => updateRangeFill(input));
}

/**
 * Updates the label text for a form-range container
 * @param input - The range input element
 * @param labelText - The text to display in the label
 */
export function updateRangeLabel(input: HTMLInputElement, labelText: string): void {
    const container = input.closest('.form-range-container');
    if (container) {
        const label = container.querySelector('.form-range-label');
        if (label) {
            label.textContent = labelText;
        }
    }
}
