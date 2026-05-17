  CinePark – Cinema Parking & Snack Booking System

> A full-stack web application for managing cinema parking spots, show schedules, and in-seat snack orders.

---

 Screenshots

### Schedule Page
![Schedule Page](screenshots/schedule.png)

### Parking Registry
![Parking Registry](screenshots/parking.png)

### Snack Selection
![Snack Selection](screenshots/snacks.png)

---

 Try it Live

 [**Open CinePark**](https://alpha-m9it.onrender.com/)

---

 Motivation

**CinePark** started as a simple parking house management system — think of it as a digital version of a street parking meter, but for an entire parking garage. Visitors can see which spots are free, register their car, and pay for their stay.

While building this system, a new idea emerged: **what if the same spot-based logic was applied to a drive-in cinema?** That thought became the foundation of the **Omega project**, where each parking spot is a cinema seat, snacks are ordered in advance, and **waiting at your spot by the time you arrive** — so you never have to leave your car.

---

 Features

-  **14-day schedule view** – browse available show dates and times
-  **Film genre display** – each time slot shows the genre and emoji (Children's Film, Comedy, Romance, Action, Horror)
-  **Interactive parking map** – 100 spots (A1–J10) with real-time availability (green = free, red = occupied)
-  **Row-based pricing** – parking prices vary by row proximity to the screen
-  **Snack ordering** – add popcorn, drinks, and sweets to your order before you arrive
-  **Expired show locking** – past screenings are automatically greyed out and unclickable
-  **Auto-cleanup** – expired booking files are automatically deleted on schedule load

---

 Tech Stack

| Layer | Technology |
|---|---|
| Language | F# |
| Web Framework | [WebSharper](https://websharper.com/) |
| UI | WebSharper.UI (reactive, client-side) |
| Server | ASP.NET Core |
| Data storage | JSON files (one per show slot) |
| Hosting | [Render / Azure / your host here] |

---

 How to Build & Run

 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (for WebSharper front-end tooling)

 Steps

```bash
# 1. Clone the repository
git clone https://github.com/torok-zeus/Alpha.git
cd Alpha

# 2. Restore dependencies
dotnet restore

# 3. Run the application
dotnet run
```

The app will start on `http://localhost:10000`.

 Debug mode (with Vite hot reload)

```bash
dotnet run --configuration Debug
```

---

Project Structure

```
/
├── Client.fs          # All client-side UI logic (WebSharper.UI reactive)
├── Remoting.fs        # Server-side RPC functions (park, load, clean)
├── Site.fs            # URL routing and page definitions
├── Startup.fs         # ASP.NET Core app configuration
└── wwwroot/           # Static assets
```

---

Pages & Routes

| Route | Description |
|---|---|
| `/` | Schedule – select date and show time |
| `/parking` | Parking Registry – choose and book a spot |
| `/payment` | Snack Selection – add snacks and place order |

---

 Deployment

The application is deployed on **[your platform]** with automatic deployment on each push to `main`.

> For server-side apps like this one (with file-based data storage), a persistent server host is required. Recommended free options: [Render](https://render.com), [Railway](https://railway.app), or [Azure App Service](https://azure.microsoft.com/en-us/products/app-service).

---

License

MIT License – feel free to use and adapt.

