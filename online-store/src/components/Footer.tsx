const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} E-Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
