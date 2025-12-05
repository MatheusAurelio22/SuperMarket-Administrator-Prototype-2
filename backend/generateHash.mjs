import bcrypt from "bcrypt";

const senha = "12345678";

const hash = await bcrypt.hash(senha, 10);

console.log("HASH GERADO:");
console.log(hash);