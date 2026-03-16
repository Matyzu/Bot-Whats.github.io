async function cargarTareas(){

let res = await fetch("/tareas");
let tareas = await res.json();

let lista = document.getElementById("lista");
lista.innerHTML="";

tareas.forEach(t=>{

let li = document.createElement("li");

li.innerHTML = `
<div>
<strong>${t.materia}</strong><br>
${t.tarea}<br>
📅 ${t.fecha_entrega}
</div>

<button onclick="eliminar(${t.id})">X</button>
`;

lista.appendChild(li);

});

}

async function eliminar(id){

await fetch("/tareas/"+id,{
method:"DELETE"
});

cargarTareas();

}

cargarTareas();

setInterval(cargarTareas,5000);