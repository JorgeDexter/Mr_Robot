'use client'

import { mockAnalytics } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Shield, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  suffix = '',
}: { 
  title: string
  value: string | number
  change: number
  icon: typeof Shield
  suffix?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {value}{suffix}
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs",
        change >= 0 ? "text-success" : "text-destructive"
      )}>
        {change >= 0 ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {Math.abs(change).toFixed(1)}% from last period
      </div>
    </CardContent>
  </Card>
)

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const data = mockAnalytics

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--muted-foreground))',
  ]

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Privacy Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track your protection metrics and costs over time
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Threats Blocked"
          value={data.threatsBlocked.toLocaleString()}
          change={data.threatsBlockedChange}
          icon={Shield}
        />
        <StatCard
          title="Uptime"
          value={data.uptime}
          change={data.uptimeChange}
          icon={Clock}
          suffix="%"
        />
        <StatCard
          title="Total Spent"
          value={`$${data.totalSpent.toFixed(2)}`}
          change={data.totalSpentChange}
          icon={DollarSign}
        />
        <StatCard
          title="Avg. Cost/Day"
          value={`$${data.avgCostPerDay.toFixed(2)}`}
          change={data.avgCostPerDayChange}
          icon={Activity}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Threats over time */}
        <Card>
          <CardHeader>
            <CardTitle>Threats Blocked Over Time</CardTitle>
            <CardDescription>Daily threat count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost over time */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Cost</CardTitle>
            <CardDescription>USDC spent per day for protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Bar 
                    dataKey="cost" 
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threats by type */}
      <Card>
        <CardHeader>
          <CardTitle>Threats by Type</CardTitle>
          <CardDescription>Breakdown of blocked threats by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.threatsByType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                  >
                    {data.threatsByType.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartColors[index % chartColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              {data.threatsByType.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">
                      {item.count.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
