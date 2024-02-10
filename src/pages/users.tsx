import axios from "axios";
import { useEffect, useState } from "react";

interface Users {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  domain: string;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
}

interface Hair {
  color: string;
  type: string;
}

interface Address {
  address: string;
  city: string;
  coordinates: Coordinates;
  postalCode: string;
  state: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface Company {
  address: Address2;
  department: string;
  name: string;
  title: string;
}

interface Address2 {
  address: string;
  city: string;
  coordinates: Coordinates2;
  postalCode: string;
  state: string;
}

interface Coordinates2 {
  lat: number;
  lng: number;
}

interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

interface IUsers {
  users: Users[];
}

interface IDepartmentSummary {
  [key: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
  };
}

const fetchData = async () => {
  try {
    const response = await axios.get<IUsers>("https://dummyjson.com/users");
    return response.data.users;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const groupByDepartment = (users: Users[]) => {
  const summary: IDepartmentSummary = {};

  users.forEach((user) => {
    const key = user.company.department;

    if (!summary[key]) {
      summary[key] = {
        male: 0,
        female: 0,
        ageRange: "",
        hair: {},
        addressUser: {}
      };
    }

    if (user.gender === "male") {
      summary[key].male++;
    } else if (user.gender === "female") {
      summary[key].female++;
    }

    if (!summary[key].ageRange) {
      summary[key].ageRange = `${user.age}-${user.age}`;
    } else {
      const [minAge, maxAge] = summary[key].ageRange.split("-").map(Number);
      summary[key].ageRange = `${Math.min(minAge, user.age)}-${Math.max(
        maxAge,
        user.age
      )}`;
    }

    if (!summary[key].hair[user.hair.color]) {
      summary[key].hair[user.hair.color] = 1;
    } else {
      summary[key].hair[user.hair.color]++;
    }

    const addressKey = `${user.firstName}${user.lastName}`;
    summary[key].addressUser[addressKey] = user.address.postalCode;
  });

  return summary;
};

const Users = () => {
  const [userDepartment, setUserDepartment] = useState("");
  const onGetUsers = async () => {
    const users = await fetchData();

    const groupedByDepartment = groupByDepartment(users);

    setUserDepartment(JSON.stringify(groupedByDepartment, undefined, 2));
  };

  useEffect(() => {
    onGetUsers();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <textarea
        style={{ width: "100%", height: "100%", fontSize: 14, padding: "16px" }}
        readOnly
        rows={30}
        value={userDepartment || ""}
      />
    </div>
  );
};

export default Users;
