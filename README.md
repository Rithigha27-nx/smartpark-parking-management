# SmartPark – Smart Parking Management System

> A DSA-driven parking management application exploring intelligent slot allocation, vehicle tracking, and congestion management.

SmartPark is a client-side parking operations demo built to demonstrate how core data structures can support slot selection, vehicle lookup, transaction sorting, and queue workflows. It provides an interactive dashboard and facility view, vehicle entry and exit flows, local records, configurable settings, and DSA-oriented insights.

> **Project status:** This repository contains a working front-end demonstration. It has no connected backend, authentication, payment processing, or cloud persistence. Some displayed analytics and DSA comparisons are estimates or explanatory UI; implementation details are called out below.

## Problem and objective

Parking workflows involve finding a suitable free bay, locating active vehicles, handling arrivals when capacity is constrained, and organizing completed transactions. SmartPark uses a small set of custom JavaScript data structures to model these operations and make their trade-offs visible in a runnable interface.

The objective is educational: connect DSA implementations to an interactive parking scenario, not to represent a production-ready parking service.

## Features

- Dashboard with occupancy summaries, quick actions, a slot preview, and a vehicle image.
- Vehicle entry with duplicate-plate checks, category-aware nearest-slot selection, and a waiting-queue option when no suitable bay is available.
- Vehicle exit with active-vehicle lookup, duration-based fee calculation, transaction creation, and freed-slot handling.
- Interactive 2D parking layout with slot status inspection and maintenance toggles.
- Waiting-queue view with capacity display, enqueue/cancel actions, and manual admission controls.
- Vehicle record search, transaction filters, sortable history, and CSV export.
- Analytics charts and operational summaries.
- DSA insights panel with hash-table statistics, selected operation measurements, and complexity explanations.
- Settings for facility details, rates, queue capacity, and demo/reset actions.
- Browser `localStorage` persistence for slots, queue contents, transactions, and settings.

## Technology

- **Language:** JavaScript (ES modules and JSX)
- **UI:** React 19, React Router 7, Tailwind CSS 3
- **Build tooling:** Vite 8
- **Charts and icons:** Recharts, Lucide React
- **HTTP client:** Axios (an API client template is present but is not connected to the app)
- **State/persistence:** React Context and browser `localStorage`

There is no server-side application or database in this repository. Core state is held in the browser; notifications and recent-activity messages are in-memory only. A REST client template in `src/services/api.js` points to a local development URL by default, but no application module currently calls it.

## Application modules

| Module | What is present |
|---|---|
| **Dashboard** | Operational summary cards, quick links, occupancy chart, slot preview, and the dashboard vehicle image at `src/assets/silver-suv.png`. |
| **Vehicle Entry** | Checks active and queued registration identifiers, selects a suitable available slot from a Min Heap, creates an entry ticket, and offers queueing when allocation fails. |
| **Vehicle Exit** | Looks up parked vehicles through the Hash Table, calculates a fee, records a transaction, and releases or reassigns the slot. Queue handoff currently scans and filters the React array state rather than using `CircularQueue.dequeueFirstEligible()`. |
| **Parking Facility** | Interactive **2D** grid of parking bays, with details and maintenance-status controls. The sidebar's “3D” label does not reflect the implementation. |
| **Waiting Queue** | Displays the waiting list and provides enqueue, cancellation, and manual admission controls. Queue state is stored as a JavaScript array in React state. |
| **Vehicle Records** | Searches vehicle/transaction details and filters, sorts, and exports transaction rows. The transaction sort uses the custom Merge Sort implementation. |
| **Analytics** | Occupancy visualization and operational summaries. Some empty-data values and peak/turnover indicators use fixed fallback or estimated calculations; they are not a complete historical analytics pipeline. |
| **DSA Insights** | Displays hash-table statistics and compares selected operations. Search measurements and Merge Sort metrics are collected in code; heap comparison counts are estimated from heap height, and queue comparisons are explanatory rather than an instrumented benchmark. |
| **Settings** | Edits facility/rate/queue settings and loads demo data or resets local state. |

## DSA architecture and implementation status

The four data structures exist as custom JavaScript implementations in `src/dsa/`. Their degree of integration differs:

| Structure | Implementation | Use in the application |
|---|---|---|
| **Min Heap** | Binary heap ordered by slot distance; includes insertion, `peekMin`, `extractMin`, heapification, removal, and heap construction. | Used for nearest-slot selection through `peekMin()`. The provider rebuilds heaps from available slots when slot state changes; allocation does not call `extractMin()` on a persistent heap. |
| **Circular Queue** | Fixed-capacity circular buffer with FIFO operations and `dequeueFirstEligible(predicate)`, which scans and rebuilds the buffer while preserving the order of the remaining entries. | The provider constructs and exposes a queue instance, but the main entry/exit queue workflows operate on array state. In particular, automatic handoff uses a separate array scan/filter, so the class's compatibility-aware dequeue is not the active handoff implementation. |
| **Hash Table** | Custom polynomial hash with separate chaining via linked nodes; supports insert/update, search, delete, and statistics. | Rebuilt from currently occupied slots and used for duplicate checks and vehicle lookup at exit. |
| **Merge Sort** | Stable recursive merge sort; returns the sorted list, comparison count, and measured elapsed time. | Used to sort the transaction table after filtering. |

### Complexity reference

`N` is the number of items/slots, `K` is queue capacity or current queue length, and `L` is the key length. Average hash-table bounds assume a reasonable key distribution.

| Operation | Time complexity | Auxiliary space | Notes |
|---|---:|---:|---|
| Min Heap `peekMin` | `O(1)` | `O(1)` | Used for allocation candidates. |
| Min Heap `insertSlot` / `extractMin` | `O(log N)` | `O(1)` per operation | Heap storage is `O(N)`; these class operations are not all used in the active allocation path. |
| Min Heap `buildHeap` | `O(N)` | `O(1)` beyond heap storage | The context currently builds its heaps with repeated inserts instead. |
| Circular Queue `enqueue` / `dequeue` / `peek` | `O(1)` | `O(1)` per operation | Fixed-capacity storage is `O(K)`. |
| Circular Queue `dequeueFirstEligible` | `O(K)` | `O(K)` | Scans the queue and reconstructs the remaining buffer. |
| Hash Table lookup/insert/delete | Average `O(1)`, worst `O(N)` | `O(N)` | Hash computation is `O(L)`; separate chaining handles collisions. |
| Merge Sort | `O(N log N)` in all cases | `O(N)` | Stable sort used on the filtered transaction list. |

These are algorithmic bounds, not claims about measured production performance. The DSA panel's heap operation count is an estimate, and its queue comparison is descriptive rather than a live benchmark.

## Project structure

```text
.
├── public/                 # Public static assets
├── screenshots/            # Location for real project screenshots
├── src/
│   ├── assets/             # UI images and static assets
│   ├── components/         # Analytics, forms, layout, parking, queue, records
│   ├── context/            # React parking state and operations
│   ├── data/               # Initial slots and synthetic demo records
│   ├── dsa/                 # Min Heap, Circular Queue, Hash Table, Merge Sort
│   ├── layouts/            # Shared application layout
│   ├── pages/              # Dashboard and application routes
│   ├── services/           # Unconnected Axios API client template
│   └── utils/              # Fee and formatting helpers
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Run locally

Use Node.js `^20.19.0` or `>=22.12.0` (the Vite 8 engine requirement) and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

Lint the source with:

```bash
npm run lint
```

There is currently no automated test script in `package.json`.

## Screenshots

**Placeholder — screenshots have not yet been captured.** Add genuine screenshots of the running application to `screenshots/` and embed them here; no mock or fabricated screenshots are included.

## Repository

Target repository: https://github.com/Rithigha27-nx/smartpark-parking-management

## Future improvements

- Connect a real backend and database, then make the API client part of the application workflow.
- Integrate `CircularQueue` into enqueue, cancellation, and automatic handoff operations, with tests for capacity, wraparound, and eligibility.
- Add automated unit and component tests for the DSA implementations and parking workflows.
- Instrument heap operations directly and distinguish measured values from estimates throughout the DSA panel.
- Replace fallback analytics with clearly scoped metrics derived from persisted event history.
- Add production concerns such as authentication, authorization, input validation, and privacy-conscious handling of vehicle/driver data.

## Team

Add project contributors and their public profiles:

- **[Name](https://github.com/username)** — [role/contribution]
- **[Name](https://github.com/username)** — [role/contribution]
