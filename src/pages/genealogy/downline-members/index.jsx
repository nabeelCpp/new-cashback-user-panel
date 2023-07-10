//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI Imports
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";

//----------
//  MUI Icon Imports
//----------
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

//----------
//  Other Libraries imports
//----------
import { toast } from "react-hot-toast";
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

const DownlineMembers = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [members, setMembers] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1, // Initial current page
  });

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadMembers = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/genealogy/downline-members`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          const tempData = response.data.map((d, key) => {
            return { key, ...d };
          });
          setDataSource(tempData);
          setData(tempData);
          setMembers(tempData);
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
    loadMembers();
  }, []);

  //----------
  //  Constants
  //----------
  const sorter = ["ascend", "descend"];
  const columns = [
    {
      title: "Sr. No",
      render: (_, object, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "User Id",
      dataIndex: "down_id",
      sorter: {
        compare: (a, b) => a.down_id.localeCompare(b.down_id),
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
      dataIndex: "fullname",
      render: (_, object, index) => object.first_name + " " + object.last_name,
    },
    {
      title: "Rank",
      dataIndex: "rank",
      render: (_, object, index) =>
        object.rank == 1
          ? "Beginner"
          : object.rank == 1
          ? "Beginner"
          : object.rank == 1
          ? "Beginner"
          : object.rank == 1
          ? "Beginner"
          : object.rank == 2
          ? "Starter"
          : object.rank == 3
          ? "Associate"
          : object.rank == 4
          ? "Sr. Associate"
          : "",
    },
    {
      title: `Level`,
      sorter: {
        compare: (a, b) => a.level - b.level,
        multiple: 2,
      },
      dataIndex: "level",
    },
    {
      title: `Investment Amount (${process.env.NEXT_PUBLIC_CURRENCY})`,
      sorter: {
        compare: (a, b) => a.amount - b.amount,
        multiple: 2,
      },
      dataIndex: "amount",
    },
    {
      title: "Register Date",
      render: (_, object) =>
        object.registration_date
          ? new Date(object.registration_date).toLocaleDateString()
          : "",
    },
  ];

  //----------
  //  Filters
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]["$d"].toLocaleDateString();
    let dateTo = filterDateRange[1]["$d"].toLocaleDateString();
    let filter = dataSource.filter(
      (d) =>
        new Date(d.registration_date) >= new Date(dateFrom) &&
        new Date(d.registration_date) <= new Date(dateTo)
    );
    setMembers(filter);
  };

  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null]);
    }
    setMembers(dataSource);
  };

  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            Total Team Members
          </Typography>
        </Box>
      </Grid>

      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <Grid container spacing={5} sx={{ p: 5 }}></Grid>
        <CardContent sx={{ overflow: "auto" }}>
          <Grid container spacing={3}>
            <Grid item md={3} xs={12} sx={{ overflow: "auto" }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ height: 50 }}
              >
                <DateRangePicker
                  calendars={2}
                  value={filterDateRange}
                  onChange={(newValue) => setFilterDateRange(newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item md={1} xs={6}>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={applyFilter}
                disabled={
                  !filterDateRange[0] || !filterDateRange[1] ? true : false
                }
                size="small"
              >
                <FilterAltIcon />
              </Button>
            </Grid>
            <Grid item md={1} xs={6}>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={resetFilter}
                color="error"
                size="small"
              >
                <FilterAltOffIcon />
              </Button>
            </Grid>
            <Grid item md={7} xs={12}>
              <Input.Search
                placeholder="Search here....."
                style={{
                  maxWidth: 300,
                  marginBottom: 8,
                  display: "block",
                  height: 50,
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
            dataSource={members}
            loading={false}
            sortDirections={sorter}
            pagination={
              data?.length > 0
                ? {
                    defaultCurrent: 1,
                    total: members?.length,
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

export default DownlineMembers;
