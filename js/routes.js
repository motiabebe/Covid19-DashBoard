const buttons = document.querySelectorAll('#Button');
const components = document.querySelectorAll('#Component');

buttons.forEach((button, componentToView) => {

    button.onclick = () => {
        components.forEach((component) => {
            component.classList.add('d-none');
    });

    components[componentToView].classList.remove('d-none');
    };
});
