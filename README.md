# Substack Feed API

The Substack Feed API is a powerful and flexible API designed to fetch and parse Substack newsletter feeds, making it easier for developers to integrate Substack content into their applications. Built with TypeScript, this API leverages modern JavaScript practices to provide a robust solution for accessing Substack newsletter data.

## Features

- **Fetch Newsletter Feeds**: Easily retrieve the latest posts from any Substack newsletter.
- **Parse Feed Data**: Convert Substack newsletter feeds into a structured format for easy integration.
- **TypeScript Support**: Enjoy the benefits of TypeScript, with type definitions for all the API responses.
- **Customizable**: Flexible API that can be tailored to fit the needs of your application.

## Getting Started

### Prerequisites

- Node.js (version 20.x or higher)
- npm (latest version)

### Installation

To use the Substack Feed API in your project, follow these steps:

1. Install the package via npm:

```bash
npm install substack-feed-api
```

2. Import the API into your project:

```typescript
import { SubstackFeedApi } from 'substack-feed-api';
```

### Usage

Here's a quick example to get you started:

```typescript
const api = new SubstackFeedApi();

api.fetchNewsletter('your-substack-newsletter-name').then(feed => {
  console.log(feed);
}).catch(error => {
  console.error('Error fetching newsletter:', error);
});
```

Replace `'your-substack-newsletter-name'` with the name of the Substack newsletter you wish to fetch.

## Development

To contribute to the Substack Feed API or run it locally for development, you will need to follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/rohit1901/substack-feed-api.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## Building

To build the project for production, run:

```bash
npm run build
```

This will generate the production-ready files in the `dist` directory.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have any improvements or bug fixes to suggest.

## License

This project is licensed under the MIT License.
```