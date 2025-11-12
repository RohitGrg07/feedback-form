import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  Chip,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Star, Logout } from "@mui/icons-material";
import { apiGet } from "../lib/api";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  const [pendingSortOrder, setPendingSortOrder] = useState<"asc" | "desc">(
    sortOrder
  );
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const resp = await apiGet<{
        data: Feedback[];
        total: number;
        page: number;
        limit: number;
      }>("/feedback", { page, limit: rowsPerPage, sort: sortOrder });

      const realData = resp.data || [];
      setFeedbackList(realData);
      setTotalCount(resp.total || realData.length);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedbackList([]);
      setTotalCount(0);
      setError("Failed to fetch feedback data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortOrder]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const applySort = (order: "asc" | "desc") => {
    setSortOrder(order);
    setPage(0);
    // fetchFeedback will be called automatically via useEffect when sortOrder changes
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortButtonClick = () => {
    setPendingSortOrder(sortOrder);
    setIsSortDialogOpen(true);
  };

  const handleSortOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPendingSortOrder(event.target.value as "asc" | "desc");
  };

  const handleSortCancel = () => {
    setIsSortDialogOpen(false);
  };

  const handleSortConfirm = () => {
    setIsSortDialogOpen(false);
    applySort(pendingSortOrder);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all submitted feedback
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{ height: "fit-content" }}
        >
          Logout
        </Button>
      </Box>

      <Paper elevation={3}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Feedback Submissions</Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip label={`Total: ${totalCount}`} color="primary" />
              <Button
                variant="outlined"
                size="small"
                onClick={fetchFeedback}
                disabled={loading}
              >
                Refresh
              </Button>
              <ButtonGroup variant="outlined" size="small">
                <Button onClick={handleSortButtonClick} variant="outlined">
                  Sort
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress />
          </Box>
        ) : feedbackList.length === 0 ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No feedback submissions yet
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedbackList.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>
                        <Rating
                          value={item.rating}
                          readOnly
                          size="small"
                          icon={<Star fontSize="inherit" />}
                          emptyIcon={<Star fontSize="inherit" />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={item.feedback}
                        >
                          {item.feedback}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDate(item.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      <Dialog open={isSortDialogOpen} onClose={handleSortCancel}>
        <DialogTitle>Sort Feedback</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            value={pendingSortOrder}
            onChange={handleSortOptionChange}
            name="sort-order"
          >
            <FormControlLabel
              value="desc"
              control={<Radio />}
              label="Newest first"
            />
            <FormControlLabel
              value="asc"
              control={<Radio />}
              label="Oldest first"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSortCancel}>Cancel</Button>
          <Button onClick={handleSortConfirm} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
