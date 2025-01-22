import axios from "axios";

export async function createUser(newUser: {clerkUserId: string; firstName: string; lastName: string; email: string; userType?: string;}) {
  const response = await axios.post(`http://localhost:3000/api/v1/users/create`, newUser);
  console.log("response", response)
  return response.data;
}