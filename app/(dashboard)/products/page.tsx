"use client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


export default function ProductPage() {
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Product name"
              />

              <Input
                type="number"
                placeholder="Price"
              />

              <Input
                type="number"
                placeholder="Stock"
                />
                <Select>
                    <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
                </Select>

                <Button>
                    Update Product
                </Button>
                 </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            
             <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>price</TableCell>
                <TableCell>stock</TableCell>
                <TableCell>
                  <Badge
                    
                  >
                    status
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                  >
                    Edit
                  </Button>
                  <Button
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}