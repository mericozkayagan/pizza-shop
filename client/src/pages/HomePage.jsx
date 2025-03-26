import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero Banner with Texture Overlay */}
      <div className="relative h-[80vh] flex items-center overflow-hidden">
        {/* Main background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
            filter: 'brightness(0.85)'
          }}
        ></div>

        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/checkered-pattern.png')",
            mixBlendMode: 'multiply'
          }}
        ></div>

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-5 px-5 py-2 rounded-full bg-red-600 shadow-lg transform -rotate-1">
            <span className="text-white font-medium tracking-wide">Authentic Italian Pizza</span>
          </div>
          <h1 className="menu-banner-title mb-6 transform hover:scale-105 transition-transform duration-500">
            Welcome to Pizza Paradise
          </h1>
          <p className="menu-banner-text max-w-2xl mx-auto mb-10">
            Enjoy the authentic taste of Italy with our handcrafted pizzas made from the freshest ingredients
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu">
              <Button variant="primary" size="lg" className="shadow-lg">
                View Our Menu
              </Button>
            </Link>
            <Link to="/tables">
              <Button variant="outline" size="lg" className="shadow-lg">
                Reserve a Table
              </Button>
            </Link>
          </div>

          {/* Pizza slice decoration */}
          <div className="absolute left-10 top-[30%] opacity-20 hidden lg:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49 3.49-7.51-7.51 3.49-3.49 7.51zm5.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
          </div>

          <div className="absolute right-10 bottom-[30%] opacity-20 hidden lg:block">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49 3.49-7.51-7.51 3.49-3.49 7.51zm5.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">Our Signature Pizzas</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Item 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1595854341625-f33e09b6a29c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Margherita Pizza"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="card-title">Margherita Classica</h3>
                <p className="card-body mb-4">
                  Our authentic Margherita pizza with San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil.
                </p>
                <Link to="/menu">
                  <Button variant="primary" fullWidth>Order Now</Button>
                </Link>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Pepperoni Pizza"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="card-title">Pepperoni Supreme</h3>
                <p className="card-body mb-4">
                  Loaded with premium pepperoni, mozzarella cheese, and our secret-recipe tomato sauce on a perfect crust.
                </p>
                <Link to="/menu">
                  <Button variant="primary" fullWidth>Order Now</Button>
                </Link>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Vegetarian Pizza"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="card-title">Vegetarian Delight</h3>
                <p className="card-body mb-4">
                  A medley of fresh vegetables including bell peppers, mushrooms, onions, black olives, and tomatoes on our signature crust.
                </p>
                <Link to="/menu">
                  <Button variant="primary" fullWidth>Order Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Summary Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img
                src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="Our restaurant"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="heading-3 text-red-700 mb-4">Our Story</h2>
              <p className="text-body-lg mb-6">
                Pizza Paradise was founded in 2010 with a simple mission: to bring the authentic taste of Italian pizzas to your neighborhood. We prioritize fresh, locally-sourced ingredients and traditional recipes.
              </p>
              <p className="text-body mb-6">
                Our chefs are trained in the art of pizza making, ensuring each pie that comes out of our wood-fired ovens is nothing short of perfection. We take pride in our craft and the joy our food brings to our customers.
              </p>
              <Link to="/about">
                <Button variant="outline">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/32.jpg"
                    alt="Customer"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-ui-bold">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-body-sm italic">
                "The best pizza I've ever had! The crust is perfectly crispy and the toppings are always fresh. I'm a regular customer now and can't imagine ordering from anywhere else."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/44.jpg"
                    alt="Customer"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-ui-bold">Michael Thomas</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-body-sm italic">
                "The online ordering system is so convenient, and the delivery is always on time. But the real star is the food - absolutely delicious! Their Margherita pizza is simple perfection."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Customer"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-ui-bold">Emily Rodriguez</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-body-sm italic">
                "We had Pizza Paradise cater our office party and it was a huge hit! Everyone was raving about the variety and quality. The staff was professional and the food was amazing."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-2 text-white mb-6">Ready to Experience Pizza Paradise?</h2>
          <p className="text-body-lg text-white max-w-2xl mx-auto mb-8 opacity-90">
            Order online for pickup or delivery, or reserve a table at our restaurant for a delightful dining experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu">
              <Button variant="secondary" size="lg">
                Order Online
              </Button>
            </Link>
            <Link to="/tables">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                Reserve a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;