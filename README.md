# Booking and Billing Management System

A web-based booking and billing application designed to manage customer details, service reservations, bill calculation, and payment status through one interface.

## Project Overview

The system provides a dashboard for viewing booking activity, pending payments, and paid revenue. Users can create bookings, check date and time-slot availability, calculate bills, view booking records, cancel bookings, and update payment status.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java 17+
- Spring Boot
- REST API

### Database
- MySQL 8+

### Build and Testing Tools
- Maven
- Postman

## Main Features

- Dashboard showing booking counts, pending payments, and paid revenue
- Customer and booking management
- Date and time-slot availability checking
- Automatic bill calculation
- Booking list with search
- Receipt generation
- Booking cancellation
- Payment-status updates
- MySQL database storage

## Requirements

Install the following before running the project:

- JDK 17 or later
- Maven 3.6+
- MySQL 8+
- A code editor such as Visual Studio Code or IntelliJ IDEA
- Postman (optional, for API testing)

## Database Setup

1. Open MySQL.
2. Create the database:

   ```sql
   CREATE DATABASE booking_billing;
   ```

3. Open `src/main/resources/application.properties`.
4. Update the MySQL username and password with your local database credentials.

Example configuration (adjust to match your project):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/booking_billing
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Do not upload real database passwords to a public repository.

## How to Run

1. Open the backend project folder in a terminal.
2. Make sure MySQL is running.
3. Check the database credentials in `application.properties`.
4. Start the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

5. Open the application in your browser:

   ```text
   http://localhost:8080
   ```

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard totals |
| GET | `/api/bookings` | Get the booking list |
| GET | `/api/bookings/{id}` | Get booking details |
| GET | `/api/availability?date=YYYY-MM-DD&slot=...` | Check slot availability |
| POST | `/api/bookings` | Create a booking and calculate its bill |
| PATCH | `/api/bookings/{id}/payment` | Update payment status |
| PATCH | `/api/bookings/{id}/cancel` | Cancel a booking |

## Example Bill Calculation

| Description | Amount |
|---|---:|
| Service charge | ₹1,000.00 |
| Additional items | ₹200.00 |
| Subtotal | ₹1,200.00 |
| Discount (5%) | ₹60.00 |
| Taxable amount | ₹1,140.00 |
| Tax (18%) | ₹205.20 |
| **Final amount** | **₹1,345.20** |

## Testing

- Use the application interface to create and review bookings.
- Use Postman to send requests to the REST API endpoints.
- Verify that booking information and payment-status changes are stored in MySQL.
- Check that an already reserved date/time slot cannot be booked again.

## Important Notes

- Payment status is managed by the application; this project does not process real UPI or card transactions through a payment gateway.
- The sample availability rule treats a date/time slot as one shared reservable slot.
- For production use, add authentication and role-based access, stronger concurrency handling, audit logs, input validation, and secure environment-based database credentials.

## Team Members

- M. Srujan
- G. Pranav
- M. Anji
- K. Charan
- Akhil

## Future Enhancements

- Customer and administrator login
- Integration with a real payment gateway
- Email, SMS, or WhatsApp notifications
- Cloud deployment
- Improved multi-room and multi-resource availability
- Detailed analytics and downloadable reports

---

**Academic Project** — Booking and Billing Management System.
