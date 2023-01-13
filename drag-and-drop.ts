// Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  // NOTE: inside every reducer function (that does the mutation) you add to the state , always update the state

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    /*
      NOTE: this is why we need a slice of the projects array inside the updateListeners function because pushing to arrays modified it externally (outside the updateListeners logic)
      NOTE: we don't know whether we'll mutate the array in other places after the next updateListeners call - which could lead to the state going out of sync with our mutation logic.
      NOTE: therefore, it is best practice to always pass a new copy of the state when calling our listeners.
    */

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    console.log(this.element, this.hostElement);
    const h2Element = document.createElement("h2");
    const h3Element = document.createElement("h3");
    const PElement = document.createElement("p");
    this.element.appendChild(h2Element);
    this.element.appendChild(h3Element);
    this.element.appendChild(PElement);
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList Class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}




interface ValidatableProjectInput {
  [prop: string]: {
    [prop: string]: {
      element: HTMLInputElement | HTMLTextAreaElement;
      rules: Array<any & {max: number, min: number}>;
    };
  };
}

let registeredInputValidator: ValidatableProjectInput = {};

function ValidateProjectInput(
  hasRange?: "hasrange",
  max?: number,
  min?: number
) {
  return function (target: any, propName: string) {
    class TargetChildClass extends target {
      private static instance: TargetChildClass;
      private constructor(..._: any[]) {
        console.log("constructor of the child input");
        super();
      }
      static configure() {
        TargetChildClass.element.addEventListener("submit", TargetChildClass.submitHandler.bind(this));
      }
      private static submitHandler(event: Event) {
        event.preventDefault();
        console.log("submitted");
      }

      static getInstance() {
        // console.log("getting instance of the project input child");
        if (!!this.instance) {
          return this.instance;
        }
        return new TargetChildClass();
      }
    }
    const targetChildSingleton = TargetChildClass.getInstance();

    const titleInputElement = targetChildSingleton.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    const descriptionInputElement = targetChildSingleton.element.querySelector(
      "#description"
    )! as HTMLTextAreaElement;
    const peopleInputElement = targetChildSingleton.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    function convertToObject<T extends string[]>(a: T) {
      const ArrayToObj = a.reduce((acc: any, curr) => {
        acc[curr] = curr;
        return acc;
      }, {});
      return ArrayToObj;
    }

    const elementProp: { [a: string]: string } = convertToObject<string[]>(
      Object.keys(target)
    );
    const validatorFields: () => Array<string | {max:number, min: number}> = () => {
      const field: Array<string | {max: number, min: number}> = [];
      field.push("required");
      if (!!hasRange && max && min) {
        if (elementProp[propName] === "peopleInputElement") {
          field.push("rangeint");
          field.push("positive");
        } else if (
          elementProp[propName] === "descriptionInputElement" ||
          elementProp[propName] === "titleInputElement"
        ) {
          field.push("rangestring");
          field.push("longenough");
        }
        field.push({
          max,
          min,
        });
      } else {
        if (
          elementProp[propName] === "descriptionInputElement" ||
          elementProp[propName] === "titleInputElement"
        ) {
          field.push("longenough");
        }
      }
      return field;
    };

    function getElementFromProp(prop: string): HTMLInputElement | HTMLTextAreaElement{
      switch (prop.toLowerCase()){
        case "titleinputelement":
          return titleInputElement;
          case "descriptioninputelement":
          return descriptionInputElement;
          case "peopleinputelement":
            return peopleInputElement;
            default: throw new Error(`invalid input property : ${prop}`);
      }
    }

    registeredInputValidator[target.name] = {
      ...registeredInputValidator[target.name],
      [propName]: {
        element: getElementFromProp(elementProp[propName]),
        rules: validatorFields(),
      },
    };
    if (elementProp[propName].toLowerCase() === "titleinputelement") {

      (targetChildSingleton.element as HTMLFormElement)!.addEventListener(
        "submit",
        (e: Event) => {
          e.preventDefault();
          console.log(target.name);
          if (!validateEntriesFromForm( target.name,registeredInputValidator)){
            confirm("one of the input fields is incorrectly provided")
          }else{
            projectState.addProject(titleInputElement.value, descriptionInputElement.value,+peopleInputElement.value)
          }

        }
      );
    }
  };
}
function validateEntriesFromForm( key:string, validatable:ValidatableProjectInput, responseData: object = {}):boolean{
  let isValid: boolean = true;
  for (const prop of Object.keys(validatable[key])){
    const {element,rules} = validatable[key][prop];
    const input = element.value;
    console.log(input)
    console.log(element,rules);
    const minMax:{min:number,  max: number} = rules[rules.length -1];
    if(rules.includes('required')){
      if(rules.includes('rangeint')){
        isValid = isValid && input != null && +input >= minMax.min && +input <= minMax.max;
      }
      else if(rules.includes('rangestring')){
        isValid = isValid && !!input && input.length <= minMax.max && input.length >= minMax.min;
      }
       if (rules.includes('positive')){
        isValid = isValid && +input > -1;
      }else if (rules.includes('longenough')){
        isValid = isValid && input.length >= 10;
      }
    }else{
      return isValid;
    }

  }
  return isValid;

}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  @ValidateProjectInput("hasrange", 40, 10)
  static titleInputElement: HTMLInputElement;
  @ValidateProjectInput()
  static descriptionInputElement: HTMLInputElement;
  @ValidateProjectInput("hasrange", 40, 5)
  static peopleInputElement: HTMLInputElement;
  static element: HTMLElement;

  private static instance: ProjectInput = new ProjectInput();

  private constructor() {
    // console.log("constructor of the project input");
    super("project-input", "app", true, "user-input");
    ProjectInput.element = this.element;
    ProjectInput.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    ProjectInput.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    ProjectInput.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
  }

  renderContent() {}


  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new ProjectInput();
  }
  
}

const prjInput = ProjectInput.getInstance(); //NOTE: this won't return a new instance of the project input since it's already called in one of the decorators
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
