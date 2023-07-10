//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from "react";

//----------
//  MUI imports
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardContent,
  Link,
} from "@mui/material";

//----------
//  Other Libraries Import
//----------
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
const scroll = "paper";

const OfficialAnnouncement = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [single, setSingle] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null);

  //----------
  //  Effects
  //----------
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/official-announcements`,
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
  //  Handlers
  //----------
  const handleClose = () => {
    setViewModal(false);
  };

  const view = (id) => {
    let filter = data.filter((d) => d.n_id == id);
    setSingle(filter[0]);
    setViewModal(true);
  };

  //----------
  //  Table Configuration
  //----------
  const columns = [
    {
      title: "SN#",
      dataIndex: "sn",
      key: "sn",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "news_name",
      key: "news_name",
      width: 400,
      sorter: (a, b) => a.news_name.localeCompare(b.news_name),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return String(record.news_name)
          .replace(" ", "")
          .toLowerCase()
          .trim()
          .includes(value.replace(" ", "").toLowerCase().trim());
      },
    },
    {
      title: "Date",
      dataIndex: "posted_date",
      key: "posted_date",
      width: 300,
      sorter: (a, b) => new Date(a.posted_date) - new Date(b.posted_date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Detail",
      dataIndex: "",
      key: "detail",
      width: 250,
      render: (text, record) => (
        <Link href="javascript:void(0)" onClick={() => view(record.n_id)}>
          View
        </Link>
      ),
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
            OFFICIAL ANNOUNCEMENTS
          </Typography>
        </Box>
      </Grid>

      <Card component="div" sx={{ position: "relative", mb: 7, p: 7 }}>
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

      <div>
        <Dialog
          open={viewModal}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            TOPUP MEMBER BUSINESS
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid item xs={12}></Grid>

              <Card component="div" sx={{ position: "relative", mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6">{single?.news_name}</Typography>
                      <Typography variant="p">{single?.description}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default OfficialAnnouncement;
