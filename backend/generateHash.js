import bcrypt from "bcrypt";

const password = "12345678";

const hash = await bcrypt.hash(password, 10);
console.log("HASH GERADO:", hash);