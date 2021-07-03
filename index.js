const FORM = document.querySelector('form')
const INPUT_FIELD = document.querySelector('#input-field')
const COMPLETED_TODOS = document.querySelector('#completed-todos')
const TOTAL_TODOS = document.querySelector('#total-todos')
const TODOS = document.querySelector('#todos')
const MESSAGE = document.querySelector('#message')
const CLEAR = document.querySelector('#clear')

const STORAGE_KEY = 'todos'

addEventListener('load', () => {
    if (localStorage.getItem(STORAGE_KEY) && JSON.parse(localStorage.getItem(STORAGE_KEY)).length !== 0) {
        const TODOS_FROM_STORAGE = JSON.parse(localStorage.getItem(STORAGE_KEY))
        const COMPLETED_TODOS_FROM_STORAGE = TODOS_FROM_STORAGE.filter(todo => todo.isCompleted === true)

        TODOS_FROM_STORAGE.forEach(todo => {
            const DIV = document.createElement('div')

            DIV.innerHTML = `
                <h3>${todo.title}</h3>
                <input type="text" value="${todo.title}">
                <div>
                    <i class="fas fa-edit"></i>
                    <i class="fas fa-trash"></i>
                </div>`

            DIV.classList.add('todo')
            if (todo.isCompleted) DIV.children[0].classList.add('completed')

            DIV.setAttribute('data-id', todo.id)

            TODOS.appendChild(DIV)

            TOTAL_TODOS.textContent = parseInt(TOTAL_TODOS.textContent) + 1
        })
        MESSAGE.style.display = 'none'
        COMPLETED_TODOS.textContent = COMPLETED_TODOS_FROM_STORAGE.length
    } else {
        MESSAGE.style.display = 'block'
    }
})

FORM.addEventListener('submit', e => {
    const INPUT_VALUE = INPUT_FIELD.value

    if (INPUT_VALUE.replace(/\s/g, '').length === 0) {
        alert('Input Can Not Be Empty')
    } else {
        const TODO_OBJECT = {
            title: INPUT_VALUE,
            isCompleted: false,
            id: 1
        }

        let html;

        let todos = []

        if (!localStorage.getItem(STORAGE_KEY) || JSON.parse(localStorage.getItem(STORAGE_KEY)).length === 0) {
            todos.push(TODO_OBJECT)

            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
            MESSAGE.style.display = 'none'
        } else {
            let id;

            todos = JSON.parse(localStorage.getItem(STORAGE_KEY))

            todos.forEach(todo => id = todo.id + 1)

            TODO_OBJECT.id = id

            todos.push(TODO_OBJECT)

            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }

        html = `
            <div class="todo" data-id="${TODO_OBJECT.id}">
                <h3>${INPUT_VALUE}</h3>
                <input type="text" value="${INPUT_VALUE}">
                <div>
                <i class="fas fa-edit"></i>
                <i class="fas fa-trash"></i>
                </div>
            </div>`

        TODOS.innerHTML += html
        TOTAL_TODOS.textContent = parseInt(TOTAL_TODOS.textContent) + 1
    }

    FORM.reset()
    e.preventDefault()
})

TODOS.addEventListener('click', e => {
    const TARGET = e.target
    const TARGET_TAG_NAME = TARGET.tagName

    if (TARGET_TAG_NAME === 'H3') {
        const ID = TARGET.parentElement.getAttribute('data-id')
        const TODOS_FROM_STORAGE = JSON.parse(localStorage.getItem(STORAGE_KEY))

        TODOS_FROM_STORAGE.forEach(todo => {
            if (todo.id == ID && TARGET.classList.contains('completed')) {
                todo.isCompleted = false

                COMPLETED_TODOS.textContent = parseInt(COMPLETED_TODOS.textContent) - 1
            }
            else if (todo.id == ID && !TARGET.classList.contains('completed')) {
                todo.isCompleted = true

                COMPLETED_TODOS.textContent = parseInt(COMPLETED_TODOS.textContent) + 1
            }
        })

        localStorage.setItem(STORAGE_KEY, JSON.stringify(TODOS_FROM_STORAGE))

        TARGET.classList.toggle('completed')
    } else if (TARGET_TAG_NAME === 'I') {
        const ICON_CLASS = TARGET.classList[1]

        if (ICON_CLASS === 'fa-edit') {
            const ALL_TODOS = Array.from(TODOS.children)
            const TARGET_PARENT = TARGET.parentElement.parentElement
            const INPUT = TARGET_PARENT.children[1]
            const TODO = TARGET_PARENT.children[0]

            ALL_TODOS.forEach(todo => {
                const TODO_ELEMENT = todo.children[0]
                const TODO_INPUT = todo.children[1]

                TODO_ELEMENT.classList.remove('hide-todo')
                TODO_INPUT.classList.remove('show-input')
            })

            TODO.classList.add('hide-todo')
            INPUT.classList.add('show-input')
            INPUT.focus()
        } else if (ICON_CLASS === 'fa-trash') {
            const PARENT_ELEMENT = TARGET.parentElement.parentElement
            const TODO_ID = PARENT_ELEMENT.getAttribute('data-id')
            let todos = JSON.parse(localStorage.getItem(STORAGE_KEY))

            todos = todos.filter(todo => todo.id != TODO_ID)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

            PARENT_ELEMENT.remove()

            TOTAL_TODOS.textContent = parseInt(TOTAL_TODOS.textContent) - 1
            if (PARENT_ELEMENT.children[0].classList.contains('completed')) COMPLETED_TODOS.textContent = parseInt(COMPLETED_TODOS.textContent) - 1
            if (TODOS.innerText == '') MESSAGE.style.display = 'block'
        }
    }
})

TODOS.addEventListener('keyup', e => {
    const TARGET = e.target
    if (TARGET.tagName === 'INPUT' && e.key === 'Enter') {
        const TARGET_PARENT = TARGET.parentElement
        const TODO = TARGET_PARENT.children[0]
        const ID = TARGET_PARENT.getAttribute('data-id')
        let storageTodos = JSON.parse(localStorage.getItem(STORAGE_KEY))

        storageTodos.forEach(todo => todo.id == ID ? todo.title = TARGET.value : '')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageTodos))

        TODO.innerText = TARGET.value
        TARGET.value = TARGET.value

        TODO.classList.remove('hide-todo')
        TARGET.classList.remove('show-input')

        if (TARGET.value.replace(/\s/g, '').length === 0) {
            storageTodos = storageTodos.filter(todo => todo.title.replace(/\s/g, '') != TARGET.value.replace(/\s/g, ''))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storageTodos))

            TARGET_PARENT.remove()
            TOTAL_TODOS.textContent = parseInt(TOTAL_TODOS.textContent) - 1
            if (TARGET_PARENT.children[0].classList.contains('completed')) COMPLETED_TODOS.textContent = parseInt(COMPLETED_TODOS.textContent) - 1
            if (TODOS.innerText == '') MESSAGE.style.display = 'block'
        }
    }
})

addEventListener('click', e => {
    if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') {
        const ALL_TODOS = Array.from(TODOS.children)
        let storageTodos = JSON.parse(localStorage.getItem(STORAGE_KEY))

        ALL_TODOS.forEach(todo => {
            const TODO_ELEMENT = todo.children[0]
            const TODO_INPUT = todo.children[1]
            const TARGET_PARENT = TODO_INPUT.parentElement
            const ID = TARGET_PARENT.getAttribute('data-id')

            storageTodos.forEach(todo => todo.id == ID ? todo.title = TODO_INPUT.value : '')
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storageTodos))

            TODO_ELEMENT.innerText = TODO_INPUT.value
            TODO_INPUT.value = TODO_INPUT.value

            TODO_ELEMENT.classList.remove('hide-todo')
            TODO_INPUT.classList.remove('show-input')

            if (TODO_INPUT.value.replace(/\s/g, '').length === 0) {
                storageTodos = storageTodos.filter(todo => todo.title.replace(/\s/g, '') != TODO_INPUT.value.replace(/\s/g, ''))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(storageTodos))

                TARGET_PARENT.remove()
                TOTAL_TODOS.textContent = parseInt(TOTAL_TODOS.textContent) - 1
                if (TODO_ELEMENT.classList.contains('completed')) COMPLETED_TODOS.textContent = parseInt(COMPLETED_TODOS.textContent) - 1
                if (TODOS.innerText == '') MESSAGE.style.display = 'block'
            }
        })
    }
})

CLEAR.addEventListener('click', () => {
    TODOS.innerHTML = ''
    localStorage.removeItem(STORAGE_KEY)
    MESSAGE.style.display = 'block'
    COMPLETED_TODOS.textContent = '0'
    TOTAL_TODOS.textContent = '0'
})