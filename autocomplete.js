const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
root.innerHTML = `
    <label><b>Search </b></label>
    <input class = "input"/>
    <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content results"></div>
        </div>
    </div>
`;

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultWrapper = root.querySelector('.results');


const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    console.log(items);

    if(!items.length){//if no item, dont show dropdown menu
        dropdown.classList.remove('is-active');
        return;
    }

    resultWrapper.innerHTML = ``;//clear the previous search
    dropdown.classList.add('is-active');
    for(let item of items){
        const option = document.createElement('a');

        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item);

        option.addEventListener('click', ()=>{//handle item selection
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);   
            onOptionSelect(item);
        })
        resultWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {//close dropdown when click outside the dropdown menu
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
})    
}