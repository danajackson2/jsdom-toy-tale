let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
	const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
 
  fetchToys()
  document.querySelector('form.add-toy-form').addEventListener("submit", formSubmit)
})

function fetchToys(){fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => renderToys(data))
}
function formSubmit(e){
  document.querySelector(".container").style.display = "none"
  e.preventDefault();
  document.querySelector(".container").display = "none"
  fetch('http://localhost:3000/toys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
  body: JSON.stringify({
    'name': e.target.name.value,
    'image': e.target.image.value,
    'likes': 0
    })  
  })
  .then(resp => resp.json())
  .then(data => addNewToy(data))
}

function addLike(event){ 
  let parent = event.target.parentElement
  fetch(`http://localhost:3000/toys/${parent.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    },
    body: JSON.stringify({
      'likes': parseInt(parent.querySelector('p').textContent) + 1 
      })  
    })
    .then(resp => resp.json())
    .then(data => {
			document.getElementById(`${parent.id}`).querySelector('p').innerText = data.likes
		})
}

function deleteToy(event){
  let parent = event.target.parentElement
  fetch(`http://localhost:3000/toys/${parent.id}`, {
    method : 'DELETE',
  })
  .then (res => res.json())
  .then(() => {
    let oldToy = document.getElementById(parent.id)
    oldToy.remove()
  })
}

function addNewToy(toy){
  let toyCollection = document.getElementById('toy-collection')
  let myDiv = document.createElement('div')
    myDiv.id = toy.id
    myDiv.classList.add('card')
    let h2 = document.createElement('h2')
    h2.innerText = toy.name
    // myDiv.appendChild(h2)
    let img = document.createElement('img')
    img.src = toy.image
    img.classList.add('toy-avatar')
    // myDiv.appendChild(img)
    let p = document.createElement('p')
    p.innerText = toy.likes
    // myDiv.appendChild(p)
    let btn = document.createElement('button')
    btn.classList.add('like-btn')
    btn.innerText = 'like'
    btn.addEventListener('click', addLike)
    delBtn = document.createElement('button')
    delBtn.id = "delete-btn"
    delBtn.innerText = "delete"
    delBtn.addEventListener('click', deleteToy)
    myDiv.append(h2, img, p, btn, delBtn)
    toyCollection.appendChild(myDiv)
}

function renderToys(toys){
  let toyCollection = document.getElementById('toy-collection')
  toyCollection.innerHTML = ""
  for(const toy of toys){
    addNewToy(toy)
  }
}