class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority

    }

}

class AddTodoButton {
    constructor(project) {
        this.project = project
        this.projectList = new ProjectList()
        this.button = document.createElement('button')
        this.button.innerText = '#TODO'
        this.button.addEventListener('click', this.displayModal.bind(this))
    }

    displayModal() {
        const modal = new bootstrap.Modal(document.getElementById('todoModal'))
        document.getElementById('saveTodo').onclick = () => {
            const title = document.getElementById('todo-title').value
            const description = document.getElementById('todo-description').value
            const dueDate = document.getElementById('todo-dueDate').value
            const priority = document.getElementById('todo-priority').value

            const newTodo = new Todo(title, description, dueDate, priority)
            this.project.addTodoToProject(newTodo)
            this.projectList.saveToLocalStorage()
            console.log("Project List after saving:", this.projectList);
            modal.hide()
            location.reload()
        }

        modal.show()
    }

    get element() {
        return this.button
    }
}

class Project {
    constructor(projectName) {
        this.projectName = projectName
        this.todoArray = []
    }
    addTodoToProject(todo) {
        this.todoArray.push(todo)
    }

}

class ProjectList {
    constructor() {
        if (ProjectList.instance) {
            return ProjectList.instance
        }
        this.projectList = []
        ProjectList.instance = this
    }
    addProject(project) {
        this.projectList.push(project)
        this.saveToLocalStorage()
    }
    saveToLocalStorage() {
        localStorage.setItem('projectList', JSON.stringify(this.projectList))
        console.log("LocalStorage after saving:", localStorage.getItem('projectList'));
    }
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('projectList')
        if (savedData) {
            this.projectList = JSON.parse(savedData).map(projectData => {
                const project = new Project(projectData.projectName)
                project.todoArray = projectData.todoArray.map(todoData => new Todo(todoData.title, todoData.description, todoData.dueDate, todoData.priority))
                return project
            })
        }
    }

}

class TodoDisplayer {
    constructor(todo, project) {
        this.todo = todo
        this.project = project
    }
    display() {
        const todoItem = document.createElement('li');
        todoItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
    
        const todoDetails = document.createElement('div');
        todoDetails.innerHTML = `
            <strong>${this.todo.title}</strong> - ${this.todo.description}
            <br>Due: ${this.todo.dueDate} | Priority: ${this.todo.priority}
        `;
        todoItem.appendChild(todoDetails);
    
        const completed = document.createElement('button');
        completed.classList.add('btn', 'btn-primary', 'ms-auto'); // ml-auto pushes button to the right
        completed.innerText = 'Done-Zo!';
        completed.addEventListener('click', () => {
            const index = this.project.todoArray.indexOf(this.todo)
            if (index > -1) {
                this.project.todoArray.splice(index, 1)
            }
            new ProjectList().saveToLocalStorage()
            todoItem.remove()
        })
        todoItem.appendChild(completed);
    
        return todoItem;
    }
}

class ProjectDisplayer {
    constructor(project) {
        this.project = project
    }
    display() {
        const projectContainer = document.createElement('div')
        projectContainer.classList.add('card', 'mt-3')

        const ProjectTitle = document.createElement('h5')
        ProjectTitle.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center')
        ProjectTitle.innerText = this.project.projectName
        const addButton = new AddTodoButton(this.project)
        ProjectTitle.appendChild(addButton.element)
        projectContainer.appendChild(ProjectTitle)

        const todoList = document.createElement('ul')
        todoList.classList.add('list-group', 'list-group-flush')
        this.project.todoArray.forEach(todo => {
            const todoDisplayer = new TodoDisplayer(todo, this.project)
            todoList.appendChild(todoDisplayer.display())
        })
        projectContainer.appendChild(todoList)
        return projectContainer
    }
}

class ProjectListDisplayer {
    constructor(projectList) {
        this.projectList = projectList
    }
    display() {
        const container = document.createElement('div')
        this.projectList.projectList.forEach(project => {
            const projectDisplay = new ProjectDisplayer(project)
            container.appendChild(projectDisplay.display())
        })
        return container
    }
}

class PageSetup {
    constructor() {
        this.projectList = new ProjectList()
        this.projectList.loadFromLocalStorage()
        this.AddProjectButton = new AddProjectButton(this.projectList)
    }
    addSampleData() {
        if (!this.projectList.projectList.length) {
            let myProject = new Project("Sample Project")
            let todoOne = new Todo("Buy Milk", "Get it from the store", "2023-10-13", "High")
            let todoTwo = new Todo("Learn to Code", "Javascript blows, need to oxidize this ish", "now son", "Mega High")
            myProject.addTodoToProject(todoOne)
            myProject.addTodoToProject(todoTwo)
            this.projectList.addProject(myProject)
        }
    }
    init() {
        this.addSampleData()
        const projectListDisplay = new ProjectListDisplayer(this.projectList)
        document.body.appendChild(projectListDisplay.display())
    }
}

class AddProjectButton {
    constructor(projectList) {
        this.projectList = projectList; 
        this.button = document.querySelector('[data-bs-target="#addProjectModal"]');
        this.setupModalEvents();
    }

    setupModalEvents() {
        const saveButton = document.getElementById('saveProject');
        console.log(saveButton)
        saveButton.addEventListener('click', this.saveProject.bind(this));
    }

    saveProject() {
        console.log("Save button clicked")
        const projectName = document.getElementById('project-name').value;
        if (projectName) {
            const newProject = new Project(projectName);
            this.projectList.addProject(newProject);
            this.projectList.saveToLocalStorage();
            location.reload(); 
        }
    }
}

new PageSetup().init()
