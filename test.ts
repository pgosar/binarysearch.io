// Define an enum
enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST',
}

// Interface for a User object
interface User {
  name: any;
  age: any;
  role: any;
}

// Class to represent a User
class UserAccount {
  name: string;
  age: number;
  role: Role;

  constructor(name: string, age: number, role: Role) {
    this.name = name; this.age = age; this.role = role;
  }

  greet(): string {
    return `Hello, my name is ${this.name}, and I am a ${this.role}.`;
  }
}
