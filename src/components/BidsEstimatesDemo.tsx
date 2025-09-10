import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, MoreVertical, Search, Filter, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockCategories = [
  "Plumbing", 
  "Electrical", 
  "HVAC", 
  "Flooring", 
  "Painting", 
  "Roofing", 
  "Carpentry"
];

const mockBids = [
  {
    id: "1",
    bidId: "bid-1",
    docIndex: 0,
    category: "Plumbing",
    name: "Install Kitchen Sink",
    quantity: 1,
    unitCost: 450.00,
    baseCost: 450.00,
    markup: 25,
    profitAmt: 112.50,
    profitMargin: 20.00,
    totalCost: 562.50
  },
  {
    id: "2",
    bidId: "bid-2",
    docIndex: 0,
    category: "Electrical",
    name: "Outlet Installation",
    quantity: 8,
    unitCost: 75.00,
    baseCost: 600.00,
    markup: 30,
    profitAmt: 180.00,
    profitMargin: 23.08,
    totalCost: 780.00
  },
  {
    id: "3",
    bidId: "bid-3",
    docIndex: 0,
    category: "HVAC",
    name: "Ductwork Repair",
    quantity: 1,
    unitCost: 1200.00,
    baseCost: 1200.00,
    markup: 20,
    profitAmt: 240.00,
    profitMargin: 16.67,
    totalCost: 1440.00
  },
  {
    id: "4",
    bidId: "bid-4",
    docIndex: 0,
    category: "Flooring",
    name: "Hardwood Installation",
    quantity: 500,
    unitCost: 8.50,
    baseCost: 4250.00,
    markup: 35,
    profitAmt: 1487.50,
    profitMargin: 25.93,
    totalCost: 5737.50
  },
  {
    id: "5",
    bidId: "bid-5",
    docIndex: 0,
    category: "Painting",
    name: "Interior Painting",
    quantity: 1,
    unitCost: 800.00,
    baseCost: 800.00,
    markup: 40,
    profitAmt: 320.00,
    profitMargin: 28.57,
    totalCost: 1120.00
  },
  {
    id: "6",
    bidId: "bid-6",
    docIndex: 0,
    category: "Plumbing",
    name: "Bathroom Fixtures",
    quantity: 3,
    unitCost: 320.00,
    baseCost: 960.00,
    markup: 28,
    profitAmt: 268.80,
    profitMargin: 21.88,
    totalCost: 1228.80
  },
  {
    id: "7",
    bidId: "bid-7",
    docIndex: 0,
    category: "Electrical",
    name: "Panel Upgrade",
    quantity: 1,
    unitCost: 2500.00,
    baseCost: 2500.00,
    markup: 22,
    profitAmt: 550.00,
    profitMargin: 18.03,
    totalCost: 3050.00
  }
];

const BidsEstimatesDemo = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bids, setBids] = useState(mockBids);
  const [categories] = useState(mockCategories);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();

  // Enhanced filtering with category support
  const filteredBids = bids.filter((bid) => {
    const matchesSearch = 
      bid.category?.toLowerCase().includes(search.toLowerCase()) ||
      bid.name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      bid.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get category counts for display
  const getCategoryCount = (category) => {
    return bids.filter(bid => bid.category === category).length;
  };

  const getTotalCount = () => bids.length;

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredBids.length / rowsPerPage) || 1;
  const paginatedBids = filteredBids.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setBids((prev) => prev.filter((b) => b.id !== deleteId));
      toast({
        title: "Success",
        description: "Bid deleted successfully",
      });
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting bid:", err);
      toast({
        title: "Error",
        description: "Failed to delete bid",
        variant: "destructive",
      });
    }
  };

  const hasActiveFilters = search || selectedCategory !== "all";

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Bids & Estimates
          </h1>
          <p className="text-muted-foreground">
            Manage your bids and estimates with category-based filtering
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Bid
        </Button>
      </div>

      {/* Enhanced Filters Section */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Input
                type="text"
                placeholder="Search items or categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 rounded-lg border-muted-foreground/20 bg-muted focus:bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-full sm:w-[240px] bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">
                    All Categories ({getTotalCount()})
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category} ({getCategoryCount(category)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" size="sm">
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: "{search}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => setSearch("")}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              ({filteredBids.length} of {bids.length} items)
            </span>
          </div>
        )}
      </Card>

      {/* Table Card */}
      <Card className="bg-card border border-border">
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="text-right font-semibold">Quantity</TableHead>
                  <TableHead className="text-right font-semibold">Unit Cost</TableHead>
                  <TableHead className="text-right font-semibold">Base Cost</TableHead>
                  <TableHead className="text-right font-semibold">Markup %</TableHead>
                  <TableHead className="text-right font-semibold">Profit Amt.</TableHead>
                  <TableHead className="text-right font-semibold">Profit Margin</TableHead>
                  <TableHead className="text-right font-semibold">Total Cost</TableHead>
                  <TableHead className="text-center font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBids.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {hasActiveFilters ? (
                          <>
                            <p className="text-muted-foreground text-lg">No items match your current filters.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={clearFilters}
                              className="gap-2"
                            >
                              <X className="w-4 h-4" />
                              Clear Filters
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted-foreground text-lg">No bids or estimates found.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBids.map((bid, idx) => (
                    <TableRow
                      key={bid.id}
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        idx % 2 === 1 && "bg-muted/20"
                      )}
                    >
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/10 font-medium">
                          {bid.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{bid.name}</TableCell>
                      <TableCell className="text-right">{bid.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${Number(bid.unitCost || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(bid.baseCost || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{bid.markup}%</TableCell>
                      <TableCell className="text-right text-success font-medium">
                        ${Number(bid.profitAmt || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(bid.profitMargin || 0).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ${Number(bid.totalCost || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover z-50">
                            <DropdownMenuItem className="cursor-pointer">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(bid.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsChange}
                className="border rounded-md px-3 py-1 text-sm focus:outline-none bg-background text-foreground border-border focus:ring-2 focus:ring-ring"
              >
                {[5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Delete Bid Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bid item? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidsEstimatesDemo;