//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import { Grid, Button, Box, Typography, Card } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";

//----------
//  MUI Icon Imports
//----------
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

//----------
//  Other Libraries Import
//----------
import { toast } from "react-hot-toast";
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

//----------
//  Constants
//----------
const sorter = ["ascend", "descend"];

const DirectMembers = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [searchedText, setSearchedText] = useState("");

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
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/genealogy/direct-members`,
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

          setData(tempData);
          setDataSource(tempData);
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
    setData(filter);
  };

  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null]);
    }
    setData(dataSource);
  };

  //----------
  //  Table Configuration
  //----------
  const columns = [
    {
      title: "#",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 100,
      render: (_, record, index) => index + 1,
    },
    {
      title: "User Id",
      dataIndex: "user_id",
      key: "user_id",
      width: 200,
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.user_id)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.first_name)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.last_name)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.amount)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.registration_date)
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
      key: "fullname",
      width: 250,
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      render: (_, record) => record.first_name + " " + record.last_name,
    },
    {
      title: `Investment Amount (${process.env.NEXT_PUBLIC_CURRENCY})`,
      dataIndex: "amount",
      key: "amount",
      width: 200,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Register Response",
      dataIndex: "registration_date",
      key: "registration_date",
      width: 200,
      sorter: (a, b) =>
        new Date(a.registration_date) - new Date(b.registration_date),
      render: (text, record) =>
        record.registration_date
          ? new Date(record.registration_date).toLocaleDateString()
          : "",
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
            Personally Referred Members
          </Typography>
        </Box>
      </Grid>

      <Card component="div" sx={{ position: "relative", mb: 7, p: 7 }}>
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
                  pageSizeOptions: ["10", "20", "50", "100"],
                  locale: { items_per_page: "" },
                }
              : false
          }
        />
      </Card>
    </>
  );
};

export default DirectMembers;
