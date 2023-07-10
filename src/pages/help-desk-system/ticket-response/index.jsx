//----------
//  React imports
//----------
import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CardContent,
  Divider,
} from "@mui/material";

//----------
//  Other Libraries Imports
//----------
import { Table, Input } from "antd";
import axios from "axios";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

const TicketResponse = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [ticket, setTicket] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();
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
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/help-desk/view-tickets`,
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

  const viewTicket = (id) => {
    let filter = data.filter((d) => d.id == id);
    setTicket(filter[0]);
    setViewModal(true);
  };

  //----------
  //  Constants
  //----------
  const columns = [
    {
      title: "SN#",
      dataIndex: "key",
      key: "sn",
      width: 60,
      sorter: (a, b) => a.key - b.key,
      render: (value, record, index) => index + 1,
    },
    {
      title: "Ticket No.",
      dataIndex: "ticket_no",
      key: "ticket_no",
      width: 80,
      sorter: (a, b) => a.ticket_no.localeCompare(b.ticket_no),
      render: (value) => (
        <>
          <Link href="javascript:void(0)" onClick={() => viewTicket(value)}>
            {value}
          </Link>
        </>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.ticket_no)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.subject)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.tasktype)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.t_date)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.status)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.description)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.c_t_date)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim()) ||
          String(record.response)
            .replace(" ", "")
            .toLowerCase()
            .trim()
            .includes(value.replace(" ", "").toLowerCase().trim())
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 400,
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Category",
      dataIndex: "tasktype",
      key: "tasktype",
      width: 100,
      sorter: (a, b) => a.tasktype.localeCompare(b.tasktype),
    },
    {
      title: "Date",
      dataIndex: "t_date",
      key: "t_date",
      width: 300,
      sorter: (a, b) => new Date(a.t_date) - new Date(b.t_date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 250,
      sorter: (a, b) => a.status - b.status,
      render: (status) => (status === 0 ? "Pending" : "Responsed"),
    },
    {
      title: "Query",
      dataIndex: "description",
      key: "description",
      width: 450,
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Date Response",
      dataIndex: "c_t_date",
      key: "c_t_date",
      width: 200,
      sorter: (a, b) => new Date(a.c_t_date) - new Date(b.c_t_date),
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      width: 250,
      sorter: (a, b) => a.response.localeCompare(b.response),
    },
  ];
  const sorter = ["ascend", "descend"];
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ my: 8 }}>
            View Ticket Response
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
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            Ticket # {ticket?.id} [
            <b>{ticket?.status == 0 ? "Pending" : "Responded"}</b>]
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Card component="div" sx={{ position: "relative", mb: 7 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {ticket?.tasktype}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {ticket?.subject}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {new Date(ticket?.t_date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">{ticket?.description}</Typography>
                  <Divider />
                  <Typography variant="h6">Admin Response</Typography>
                  <Typography variant="body2">
                    {ticket?.response ? ticket.response : "-"}
                  </Typography>
                  {ticket?.c_t_date ? (
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {new Date(ticket.c_t_date).toLocaleString()}
                    </Typography>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            {/* <Button onClick={changeStatus}>Submit</Button> */}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default TicketResponse;
