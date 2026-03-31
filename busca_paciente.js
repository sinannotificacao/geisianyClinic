const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const pacientesRef = db.ref('pacientes');

const buscarForm = document.getElementById('buscar-form');
const resultadosDiv = document.getElementById('resultados');
const cadastroDiv = document.getElementById('cadastro');
const cadastroForm = document.getElementById('cadastro-form');

buscarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  resultadosDiv.innerHTML = '';
  cadastroDiv.style.display = 'none';

  const nomeBusca = document.getElementById('nome-busca').value.toLowerCase();
  const nascBusca = document.getElementById('nasc-busca').value;

  pacientesRef.once('value', (snapshot) => {
    const pacientes = snapshot.val();
    let encontrados = [];

    for (let id in pacientes) {
      const p = pacientes[id];
      if (p.nome.toLowerCase() === nomeBusca && p.nascimento === nascBusca) {
        encontrados.push({id, ...p});
      }
    }

    if (encontrados.length > 0) {
      encontrados.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('paciente');
        div.innerHTML = `<strong>${p.nome}</strong> - Nascimento: ${p.nascimento} - CPF: ${p.cpf} - Telefone: ${p.telefone}`;
        resultadosDiv.appendChild(div);
      });
    } else {
      cadastroDiv.style.display = 'block';
      document.getElementById('nome').value = document.getElementById('nome-busca').value;
      document.getElementById('nascimento').value = nascBusca;
    }
  });
});

cadastroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const nascimento = document.getElementById('nascimento').value;
  const nomeMae = document.getElementById('nome-mae').value;
  const cpf = document.getElementById('cpf').value;
  const telefone = document.getElementById('telefone').value;

  pacientesRef.push({nome, nascimento, nomeMae, cpf, telefone});
  alert('Paciente cadastrado com sucesso!');
  cadastroForm.reset();
  cadastroDiv.style.display = 'none';
});