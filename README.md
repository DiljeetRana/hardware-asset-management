# Anthem InfoTech - Hardware Asset Management System

A comprehensive web application for managing hardware assets, tracking device assignments, and monitoring employee allocations.

## Features

### Admin Portal
- **Dashboard**: Overview of all devices, employees, and assignments with real-time statistics
- **Device Management**: Add, edit, delete, and track all hardware assets (Laptops, Desktops, Mobiles, Tablets, Peripherals)
- **Employee Management**: Manage staff members and view their device assignment history
- **Assignment System**: Assign devices to employees with automatic constraint validation
- **Assignment Logs**: Complete audit trail of all device assignments and returns
- **Settings**: Data management and system configuration

### Employee Portal
- **My Devices**: View all currently assigned devices with detailed information
- **Device Details**: Access specifications, warranty information, and support details
- **Assignment History**: Complete timeline of past and current device assignments
- **Personal Dashboard**: Quick overview of assigned hardware

## Key Features

### Device Management
- Comprehensive device profiles with purchase information
- Warranty tracking and status monitoring
- Technical specifications storage
- File attachments support (images, invoices, documents)
- Multiple device types: Laptop, Desktop, Mobile, Tablet, Peripheral

### Assignment Rules
- One device per type per employee (except peripherals)
- Automatic validation prevents duplicate assignments
- Time-based assignment tracking with start and return dates
- Assignment notes and history logging

### User Roles
- **Admin**: Full system access with device and employee management
- **Employee**: View-only access to personal device assignments

## Demo Credentials

### Administrator
- Email: admin@antheminfotech.com
- Password: admin123

### Employee
- Email: employee@antheminfotech.com
- Password: employee123

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Storage**: Local Storage (browser-based)
- **Icons**: Lucide React
- **Typography**: Geist font family

## Dummy Data

The application comes pre-loaded with:
- 12 hardware devices (laptops, desktops, mobiles, tablets, peripherals)
- 5 employee profiles
- Sample assignment records

## Features Implemented

### Authentication
- Role-based login system
- Persistent sessions via localStorage
- Separate admin and employee dashboards

### Device Features
- Full CRUD operations for devices
- Advanced filtering by type, status, brand
- Detailed device profiles with tabs
- Assignment and unassignment workflows
- Complete assignment history per device

### Employee Features
- Employee management with department tracking
- Device allocation history per employee
- Active and historical device views
- Employee profile pages with assignment logs

### Assignment System
- Modal-based assignment workflow
- Constraint validation (one device type per employee)
- Return date tracking
- Notes and comments support
- Complete audit trail

## Design System

The application follows the Anthem InfoTech branding with:
- Primary color: Deep blue (#2563eb)
- Background: Slate dark theme
- Accent colors: Green, Orange, Purple for status indicators
- Modern card-based layouts
- Responsive design for all screen sizes

## Data Management

All data is stored in browser localStorage with the following structure:
- `devices`: Array of device objects
- `employees`: Array of employee objects
- `assignments`: Array of assignment records with relationships
- `dataInitialized`: Flag for dummy data initialization

## Reset Options

The Settings page provides:
- Reset to demo data (restore defaults)
- Clear all data (complete system reset)
