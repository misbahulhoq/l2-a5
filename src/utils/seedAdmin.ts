import { User } from "../modules/user/user.model";

export async function seedAdmin(email: string, password: string) {
  const adminExists = await User.findOne({ email });
  if (adminExists) {
    console.log("Admin already exists.");
    return;
  }
  const admin = new User({
    name: "Admin",
    email,
    password,
    role: "admin",
    status: "active",
  });
  await admin.save();
  console.log("Admin created successfully.");
}

export default seedAdmin;
