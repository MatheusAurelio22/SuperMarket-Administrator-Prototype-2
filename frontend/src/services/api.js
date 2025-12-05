export const API = 'http://localhost:4000/api';
export async function login(email,password){
  try{
    const r = await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    return await r.json();
  }catch(e){
    return { message: 'Erro ao conectar' }
  }
} 
export async function registerUser(name,email,cpf,password){
  const r = await fetch(API + '/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,cpf,password})});
  return r.json();
}
export async function getProducts(token){
  const r = await fetch(API + '/products',{headers:{'Authorization':'Bearer '+token}});
  return r.json();
}
export async function addProduct(formData, token){
  const r = await fetch(API + '/products',{method:'POST',headers:{'Authorization':'Bearer '+token},body:formData});
  return r.json();
}
export async function applyPromo(id, body, token){
  const r = await fetch(API + `/products/${id}/promo`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(body)});
  return r.json();
}
export async function removePromo(id, token){
  const r = await fetch(API + `/products/${id}/promo`,{method:'DELETE',headers:{'Authorization':'Bearer '+token}});
  return r.json();
}
export async function getUsers(token){
  const r = await fetch(API + '/users',{headers:{'Authorization':'Bearer '+token}});
  return r.json();
}
export async function getUser(id, token){
  const r = await fetch(API + '/users/'+id,{headers:{'Authorization':'Bearer '+token}});
  return r.json();
}
export async function createUser(body, token){
  const r = await fetch(API + '/users',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(body)});
  return r.json();
}
export async function updateUser(id, body, token){
  const r = await fetch(API + '/users/'+id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(body)});
  return r.json();
}
export async function deleteUser(id, token){
  const r = await fetch(API + '/users/'+id,{method:'DELETE',headers:{'Authorization':'Bearer '+token}});
  return r.json();
}
export async function uploadUserPhoto(id, file, token){
  const fd = new FormData();
  fd.append('photo', file);
  const r = await fetch(API + '/users/'+id+'/photo',{method:'POST',headers:{'Authorization':'Bearer '+token},body:fd});
  return r.json();
}
