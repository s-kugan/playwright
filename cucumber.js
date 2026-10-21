module.exports = {
    default: {
        requireModule: ['tsx/cjs'],
        require: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
        format: ['progress-bar', 'html:cucumber-report.html'],
    },
};
