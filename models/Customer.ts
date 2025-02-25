// export default interface Customer {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
//   address: string;
//   nic: string;
//   nicPhoto1: string;
//   nicPhoto2: string;
// }

export default interface Customer {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string | null;
  nic: string | null;
  nicPhoto1: string | null;
  nicPhoto2: string | null;
  driverLicenseNum: string |null;
  driverLicensePhoto: string | null;
}
