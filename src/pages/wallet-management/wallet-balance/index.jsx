import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

//----------
//  Other libraries imports
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const walletBalance = () => {
  //----------
  //  Hooks & states
  //----------
  const auth = useAuth();
  const [data, setData] = useState([]);

  //----------
  //  Functions
  //----------
  function createData(number, calories, fat, carbs, protein) {
    return { number, calories, fat, carbs, protein };
  }

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/mywallet`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        });
    };
    loadData();
  }, []);

  //----------
  //  Constants
  //----------
  const rows = [
    createData(
      1,
      "Income Wallet",
      new Intl.NumberFormat(`${localStorage.localization}`, {
        style: "currency",
        currency: process.env.NEXT_PUBLIC_CURRENCY,
      }).format(data.amount)
    ),
  ];

  //----------
  //  JSX
  //----------
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="center">Wallet</TableCell>
            <TableCell align="center">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.number}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.number}
              </TableCell>
              <TableCell align="center">{row.calories}</TableCell>
              <TableCell align="center">{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default walletBalance;
