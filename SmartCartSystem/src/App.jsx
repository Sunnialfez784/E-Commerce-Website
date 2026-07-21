import Cards from "./components/Cards";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Bikes from "./pages/Bikes";
import Laptops from "./pages/Laptops";
import Mobiles from "./pages/Mobiles";
import Navbar from "./components/Navbar";
import Errors from "./pages/Errors";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Details from "./components/Details";
import AddToCart from "./components/AddToCart";
import Order from "./components/Order";
import Profile from "./components/Profile";
import Fashion from "./pages/Fashion";
import Furniture from "./pages/Furniture";
import Sports from "./pages/Sports";
import Toys from "./pages/Toys";
import Keychain from "./pages/Keychain";
import Camera from "./pages/Camera";
import Headset from "./pages/Headset";
import Shoes from "./pages/Shoes";
import Watch from "./pages/Watch";
import Speaker from "./pages/Speaker";
import Instrument from "./pages/Instrument";
import Beauty from "./pages/Beauty";
import BillingDetails from "./pages/BillingDetails";
import Payment from "./pages/Payment";
import ProductBill from "./pages/ProductBill";
import RazorPay from "./components/RazorPay";
import ForgotPassword from "./pages/ForgotPassword";
import SendingEmail from "./pages/SendingEmail";
import SendingOtp from "./pages/SendingOtp";
import HasnainAbout from "./pages/HasnainAbout";
import AlfezAbout from "./pages/AlfezAbout";
import AboutSection from "./pages/AboutSection";
import Books from "./pages/Books";
import Layout from "./components/Layout";
import {ToastContainer} from "react-toastify";

function App() {
  return (
    <div className="w-full min-h-screen bg-[#f7f7fb] overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/sendingemail" element={<SendingEmail />} />
        <Route path="/sendingotp" element={<SendingOtp />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/hasnainabout" element={<HasnainAbout />} />
        <Route path="/alfezabout" element={<AlfezAbout />} />
        <Route path="/about" element={<AboutSection />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />

        <Route element={<Layout />}>
          <Route
            path="/cars"
            element={
              <ProtectedRoute>
                <Cars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bikes"
            element={
              <ProtectedRoute>
                <Bikes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laptops"
            element={
              <ProtectedRoute>
                <Laptops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mobiles"
            element={
              <ProtectedRoute>
                <Mobiles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fashion"
            element={
              <ProtectedRoute>
                <Fashion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/furniture"
            element={
              <ProtectedRoute>
                <Furniture />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports"
            element={
              <ProtectedRoute>
                <Sports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kids"
            element={
              <ProtectedRoute>
                <Toys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/keychain"
            element={
              <ProtectedRoute>
                <Keychain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/camera"
            element={
              <ProtectedRoute>
                <Camera />
              </ProtectedRoute>
            }
          />
          <Route
            path="/headset"
            element={
              <ProtectedRoute>
                <Headset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shoes"
            element={
              <ProtectedRoute>
                <Shoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch"
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/speaker"
            element={
              <ProtectedRoute>
                <Speaker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instrument"
            element={
              <ProtectedRoute>
                <Instrument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beauty"
            element={
              <ProtectedRoute>
                <Beauty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billingdetails"
            element={
              <ProtectedRoute>
                <BillingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addtocart"
          element={
            <ProtectedRoute>
              <AddToCart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productbill"
          element={
            <ProtectedRoute>
              <ProductBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <ProductBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/razor"
          element={
            <ProtectedRoute>
              <RazorPay />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover={false} pauseOnFocusLoss={false} draggable newestOnTop />
    </div>
  );
}

export default App;
