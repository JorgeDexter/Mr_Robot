'use client'

import { mockDevices, type Device } from '@/lib/mock-data'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Chrome,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  Shield
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const deviceIcons: Record<Device['type'], typeof Laptop> = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  browser_extension: Chrome,
}

const statusColors: Record<Device['status'], string> = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  paused: 'bg-warning',
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState('')
  const [newDeviceType, setNewDeviceType] = useState<Device['type']>('desktop')

  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const totalThreatsBlocked = devices.reduce((sum, d) => sum + d.threatsBlocked, 0)
  const totalCost = devices.reduce((sum, d) => sum + d.totalCost, 0)

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) return

    const newDevice: Device = {
      id: `device-${Date.now()}`,
      name: newDeviceName,
      type: newDeviceType,
      status: 'online',
      lastSeen: new Date(),
      threatsBlocked: 0,
      totalCost: 0,
    }

    setDevices([...devices, newDevice])
    setNewDeviceName('')
    setNewDeviceType('desktop')
    setIsAddDialogOpen(false)
    
    toast.success('Device added', {
      description: `${newDeviceName} is now protected.`,
    })
  }

  const handleToggleDevice = (deviceId: string) => {
    setDevices(devices.map(d => {
      if (d.id === deviceId) {
        const newStatus = d.status === 'paused' ? 'online' : 'paused'
        toast.success(newStatus === 'paused' ? 'Device paused' : 'Device resumed')
        return { ...d, status: newStatus }
      }
      return d
    }))
  }

  const handleRemoveDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId)
    setDevices(devices.filter(d => d.id !== deviceId))
    toast.success('Device removed', {
      description: `${device?.name} has been removed.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Devices
            </CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {onlineDevices} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Online Now
            </CardTitle>
            <div className="flex h-4 w-4 items-center justify-center">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              Currently protected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Threats Blocked
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThreatsBlocked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All-time spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Devices table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>Manage devices protected by PHANTOM LAYER</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Add a device to protect with PHANTOM LAYER
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    placeholder="e.g., Work MacBook"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select 
                    value={newDeviceType} 
                    onValueChange={(v) => setNewDeviceType(v as Device['type'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="browser_extension">Browser Extension</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} disabled={!newDeviceName.trim()}>
                  Add Device
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Threats Blocked</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                const Icon = deviceIcons[device.type]
                return (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs capitalize text-muted-foreground">
                            {device.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          statusColors[device.status]
                        )} />
                        <span className="capitalize text-sm">{device.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {device.status === 'online' 
                        ? 'Now' 
                        : new Date(device.lastSeen).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {device.threatsBlocked.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      ${device.totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleDevice(device.id)}>
                            {device.status === 'paused' ? (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </>
                            ) : (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveDevice(device.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
