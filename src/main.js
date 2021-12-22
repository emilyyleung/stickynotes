const toggleButton = document.getElementById("switch-mode");
const body = document.getElementById("application")

const themeIcon = {
	"light": "🌚",
	"dark": "🌞"
}

// const themeIcon = {
// 	"light": "&#127768",
// 	"dark": "&#127774"
// }

body.setAttribute("data-theme", localStorage.getItem("stickynotes-theme") || "light")
var currentTheme = body.getAttribute("data-theme");
toggleButton.innerHTML = themeIcon[currentTheme]

toggleButton.addEventListener("click", () => {
	var currentTheme = body.getAttribute("data-theme");
	var newTheme = currentTheme == "dark" ? "light" : "dark";
	body.setAttribute("data-theme", newTheme);
	toggleButton.innerHTML = themeIcon[newTheme]
	localStorage.setItem("stickynotes-theme", newTheme);
});

const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach(note => {
	const noteElement = createNoteElement(note.id, note.content);
	notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => { addNote() });

function getNotes() {
	// retrieves all of the existing notes from local storage in the client's browser
	return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
	// takes an array of notes
	// save the new notes to the local storage in the client's browser
	localStorage.setItem("stickynotes-notes", JSON.stringify(notes))
}

function createNoteElement(id, content) {
	// builds a new HTML element to represent a note
	const element = document.createElement("textarea");

	element.classList.add("note");
	element.value = content;
	element.placeholder = "Empty sticky note";

	element.addEventListener("change", () => {
		updateNote(id, element.value);
	})

	element.addEventListener("dblclick", () => {
		const doDelete = confirm("Are you sure you wish to delete?")

		if (doDelete) {
			deleteNote(id, element);
		}
	})

	return element;
}

function addNote() {
	// adds a new note to the HTML and local storage
	
	// retrieves all existing notes from local storage
	const notes = getNotes()
	// construct a base note object
	const noteObject = {
		id: Math.floor(Math.random() * 100000),
		content: ""
	}
	// create the HTML note element
	const noteElement = createNoteElement(noteObject.id, noteObject.content);
	// add the HTML note element to the DOM
	notesContainer.insertBefore(noteElement, addNoteButton);

	// add the note object to the existing notes
	notes.push(noteObject);
	// overwrite value currently in local storage with new array
	saveNotes(notes)
}

function updateNote(id, newContent) {
	// updates existing note
	
	// retrieves all existing notes from local storage
	const notes = getNotes()

	// filters through all the notes based on a set of criteria
	// since it returns an array, select the first item
	const targetNote = notes.filter(note => note.id == id)[0];
	// update the content of the note
	targetNote.content = newContent;
	// overwrite value currently in local storage with new array
	saveNotes(notes);
}

function deleteNote(id, element) {
	// deletes an existing note from the HTML and local storage
	
	// retrieves all existing notes from local storage
	// filter to return all except the note to be deleted
	const notes = getNotes().filter(note => note.id != id);
	// overwrite value currently in local storage with new array
	saveNotes(notes);
	// remove the HTML note element from the DOM
	notesContainer.removeChild(element);
}