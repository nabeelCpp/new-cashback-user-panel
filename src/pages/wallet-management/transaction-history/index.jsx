//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  Mui imports
//----------
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
//----------
//  Other Libraries
//----------
import { toast } from "react-hot-toast";
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const TransactionHistory = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [amount, setAmount] = useState(0);
  const [searchedText, setSearchedText] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/transactions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setData(response.data.transactions);
          setDataSource(response.data.transactions);
          setAmount(response.data.amount);
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
  // Constants
  //----------
  const sorter = ["ascend", "descend"];

  //----------
  //  Table Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]["$d"].toLocaleDateString();
    let dateTo = filterDateRange[1]["$d"].toLocaleDateString();
    // let filter = dataSource.filter(d => (( filterUserId && d.user_id == filterUserId ) || ( filterUserName && d.username == filterUserName) || (new Date(d.registration_date) >= new Date(dateFrom) && new Date(d.registration_date) <= new Date(dateTo) )))
    let filter = dataSource.filter( (d) => new Date(d.ts) >= new Date(dateFrom) && new Date(d.ts) <= new Date(dateTo));
    setData(filter);
  };

  //----------
  //  Table Actions - Reset  Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null]);
    }
    setData(dataSource);
  };

  const columns = [
    {
      title: "Sr. No",
      render: (_, object, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Transaction No",
      dataIndex: "transaction_no",
      sorter: {
        compare: (a, b) => a.transaction_no.localeCompare(b.transaction_no),
        multiple: 2,
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.transaction_no)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.full_name)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.sender_id)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.credit_amt)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.debit_amt)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.TranDescription)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.ts)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim())
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      sorter: {
        compare: (a, b) => a.full_name.localeCompare(b.full_name),
        multiple: 2,
      },
    },
    {
      title: "User Id",
      dataIndex: "sender_id",
      sorter: {
        compare: (a, b) => a.transaction_no.localeCompare(b.transaction_no),
        multiple: 2,
      },
    },
    {
      title: `Credit (${process.env.NEXT_PUBLIC_CURRENCY})`,
      sorter: {
        compare: (a, b) => a.credit_amt - b.credit_amt,
        multiple: 2,
      },
      dataIndex: "credit_amt",
    },
    {
      title: `Debit (${process.env.NEXT_PUBLIC_CURRENCY})`,
      sorter: {
        compare: (a, b) => a.debit_amt.localeCompare(b.debit_amt),
        multiple: 2,
      },
      dataIndex: "debit_amt",
    },
    {
      title: "Remark",
      sorter: {
        compare: (a, b) => a.debit_amt.localeCompare(b.debit_amt),
        multiple: 2,
      },
      dataIndex: "TranDescription",
    },
    {
      title: "Date",
      render: (_, object) => new Date(object.ts).toLocaleString(),
    },
  ];

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            Bonus Wallet Transaction History
          </Typography>
          <Typography variant="h6" sx={{ my: 8 }}>
            Wallet Balance :{" "}
            {new Intl.NumberFormat(`${localStorage.localization}`, {
              style: "currency",
              currency: process.env.NEXT_PUBLIC_CURRENCY,
            }).format(amount)}
          </Typography>
        </Box>
      </Grid>
      
      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <CardContent sx={{ overflow: "auto" }}>
          <Grid container sx={{ display: "flex",alignItems:'center',mb:3}}>
          <Grid id="datepicker-list" item md={3} xs={12} sx={{ display: "flex",pr:2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mb: 2 }}>
          <DateRangePicker
            calendars={2}
            value={filterDateRange}
            onChange={(newValue) => setFilterDateRange(newValue)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={2} xs={12} sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ mr: 1 }}
          onClick={applyFilter}
          disabled={!filterDateRange[0] || !filterDateRange[1] ? true : false}
          size="small"
        >
          <FilterAltIcon />
        </Button>

        <Button
          variant="contained"
          onClick={resetFilter}
          color="error"
          size="small"
        >
          <FilterAltOffIcon />
        </Button>
      </Grid>
<Grid md={7} xs={12}>
  <Input.Search
            placeholder="Search here....."
            style={{
              maxWidth: 300,
              display: "block",
              float: "right",
              border: "black",
            }}
            onSearch={(value) => {
              setSearchedText(value);
            }}
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
          />
</Grid>
      
          </Grid>
          
          <Table
            columns={columns}
            dataSource={data}
            loading={false}
            sortDirections={sorter}
            pagination={
              data?.length > 0
                ? {
                    defaultCurrent: 1,
                    total: data?.length,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `Total: ${total}`,
                    pageSizeOptions: ["10", "25", "50", "100"],
                    locale: { items_per_page: "" },
                  }
                : false
            }
            onChange={(pagination) => setPagination(pagination)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionHistory;
