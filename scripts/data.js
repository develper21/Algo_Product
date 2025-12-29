// Product Database - Real-world e-commerce data
const products = [
    {
        id: 1,
        name: "Apple iPhone 15 Pro Max",
        category: "Electronics",
        images: [
            "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        colorImages: {
            "Natural Titanium": [
                "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            "Blue Titanium": [
                "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            "White Titanium": [
                "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            "Black Titanium": [
                "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800"
            ]
        },
        price: 134900,
        originalPrice: 159900,
        rating: 4.6,
        reviews: 2847,
        stock: 12,
        brand: "Apple",
        description: "Experience the pinnacle of smartphone innovation with the iPhone 15 Pro Max. Featuring a stunning titanium design, powerful A17 Pro chip, and revolutionary camera system with 5x optical zoom.",
        specifications: {
            "Display": "6.7-inch Super Retina XDR display",
            "Processor": "A17 Pro chip with 6-core CPU",
            "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto (5x optical zoom)",
            "Storage": "256GB",
            "Battery": "Up to 29 hours video playback",
            "OS": "iOS 17",
            "Material": "Titanium with textured matte glass back",
            "Water Resistance": "IP68 (maximum depth of 6 meters up to 30 minutes)"
        },
        variants: [
            { type: "color", name: "Natural Titanium", available: true },
            { type: "color", name: "Blue Titanium", available: true },
            { type: "color", name: "White Titanium", available: true },
            { type: "color", name: "Black Titanium", available: false }
        ],
        customerReviews: [
            {
                name: "Rajesh Kumar",
                rating: 5,
                date: "2024-12-15",
                comment: "Absolutely stunning phone! The camera quality is mind-blowing, especially the 5x zoom. Battery lasts all day even with heavy usage.",
                verified: true
            },
            {
                name: "Priya Sharma",
                rating: 4,
                date: "2024-12-10",
                comment: "Great phone but quite expensive. The titanium build feels premium and the performance is top-notch. Face ID works flawlessly.",
                verified: true
            },
            {
                name: "Amit Patel",
                rating: 5,
                date: "2024-12-05",
                comment: "Best iPhone ever! The Action button is super useful and the display is gorgeous. Worth every penny.",
                verified: true
            }
        ],
        delivery: "Free delivery by 28 Dec",
        returnPolicy: "10 days return & exchange"
    },
    {
        id: 2,
        name: "Sony WH-1000XM5 Wireless Headphones",
        category: "Audio",
        images: [
            "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/3587477/pexels-photo-3587477.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 26990,
        originalPrice: 34990,
        rating: 4.7,
        reviews: 5234,
        stock: 28,
        brand: "Sony",
        description: "Industry-leading noise cancellation with the WH-1000XM5. Two processors control 8 microphones for unprecedented noise cancellation. Enjoy premium sound quality with crystal-clear hands-free calling.",
        specifications: {
            "Driver Unit": "30mm",
            "Frequency Response": "4Hz-40,000Hz",
            "Battery Life": "Up to 30 hours with ANC",
            "Charging": "USB-C Quick charging (3 min = 3 hours)",
            "Bluetooth": "Version 5.2",
            "Weight": "250g",
            "Noise Cancellation": "Industry-leading with 8 microphones",
            "Voice Assistant": "Alexa, Google Assistant built-in"
        },
        variants: [
            { type: "color", name: "Black", available: true },
            { type: "color", name: "Silver", available: true }
        ],
        customerReviews: [
            {
                name: "Sneha Reddy",
                rating: 5,
                date: "2024-12-18",
                comment: "Best noise cancellation I've ever experienced! Perfect for flights and work from home. Sound quality is exceptional.",
                verified: true
            },
            {
                name: "Vikram Singh",
                rating: 5,
                date: "2024-12-12",
                comment: "Extremely comfortable for long listening sessions. The multipoint connection is very convenient. Highly recommended!",
                verified: true
            },
            {
                name: "Ananya Das",
                rating: 4,
                date: "2024-12-08",
                comment: "Great headphones but a bit pricey. The call quality is crystal clear and battery life is amazing.",
                verified: true
            }
        ],
        delivery: "Free delivery by 27 Dec",
        returnPolicy: "10 days return & exchange"
    },
    {
        id: 3,
        name: "Samsung 55\" Crystal 4K UHD Smart TV",
        category: "Electronics",
        images: [
            "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1201993/pexels-photo-1201993.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1201995/pexels-photo-1201995.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1201999/pexels-photo-1201999.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 44990,
        originalPrice: 64990,
        rating: 4.4,
        reviews: 8921,
        stock: 15,
        brand: "Samsung",
        description: "Immerse yourself in stunning 4K resolution with the Samsung Crystal UHD TV. Experience vibrant colors, powerful contrast, and smart features powered by Tizen OS.",
        specifications: {
            "Screen Size": "55 inches (139 cm)",
            "Resolution": "4K Ultra HD (3840 x 2160)",
            "Display Type": "Crystal UHD",
            "Refresh Rate": "60Hz",
            "Smart TV": "Tizen OS",
            "HDMI Ports": "3",
            "USB Ports": "2",
            "Audio": "20W Dolby Digital Plus",
            "Connectivity": "WiFi, Bluetooth, Ethernet"
        },
        variants: [
            { type: "size", name: "43 inch", available: true },
            { type: "size", name: "55 inch", available: true },
            { type: "size", name: "65 inch", available: true }
        ],
        customerReviews: [
            {
                name: "Karthik Menon",
                rating: 5,
                date: "2024-12-14",
                comment: "Excellent picture quality for the price! Setup was easy and the smart features work smoothly. Great value for money.",
                verified: true
            },
            {
                name: "Deepa Iyer",
                rating: 4,
                date: "2024-12-09",
                comment: "Good TV with vibrant colors. The remote is user-friendly. Only wish it had more HDMI ports.",
                verified: true
            },
            {
                name: "Rahul Joshi",
                rating: 4,
                date: "2024-12-03",
                comment: "Solid performance. Netflix and Prime Video work perfectly. Sound quality is decent but I use a soundbar.",
                verified: true
            }
        ],
        delivery: "Free delivery by 30 Dec",
        returnPolicy: "7 days return & exchange"
    },
    {
        id: 4,
        name: "Nike Air Zoom Pegasus 40 Running Shoes",
        category: "Fashion",
        images: [
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 10795,
        originalPrice: 12795,
        rating: 4.5,
        reviews: 1456,
        stock: 42,
        brand: "Nike",
        description: "Run in comfort with the Nike Air Zoom Pegasus 40. Featuring responsive cushioning and a breathable design, these shoes are perfect for daily runs and training sessions.",
        specifications: {
            "Upper Material": "Engineered mesh",
            "Midsole": "React foam with Zoom Air units",
            "Outsole": "Waffle-inspired rubber",
            "Weight": "285g (approx)",
            "Drop": "10mm",
            "Use": "Road running, training",
            "Fit": "True to size",
            "Closure": "Lace-up"
        },
        variants: [
            { type: "size", name: "UK 7", available: true },
            { type: "size", name: "UK 8", available: true },
            { type: "size", name: "UK 9", available: true },
            { type: "size", name: "UK 10", available: true },
            { type: "size", name: "UK 11", available: false }
        ],
        customerReviews: [
            {
                name: "Arjun Nair",
                rating: 5,
                date: "2024-12-16",
                comment: "Perfect running shoes! Very comfortable and provides excellent support. I've run 50km in these already.",
                verified: true
            },
            {
                name: "Meera Kapoor",
                rating: 4,
                date: "2024-12-11",
                comment: "Great cushioning and lightweight. Fits true to size. Good for both running and gym workouts.",
                verified: true
            },
            {
                name: "Sanjay Gupta",
                rating: 5,
                date: "2024-12-06",
                comment: "Best Pegasus version yet! The Zoom Air feels responsive and the breathability is excellent.",
                verified: true
            }
        ],
        delivery: "Free delivery by 28 Dec",
        returnPolicy: "14 days return & exchange"
    },
    {
        id: 5,
        name: "Dyson V15 Detect Absolute Cordless Vacuum",
        category: "Home Appliances",
        images: [
            "https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/4107279/pexels-photo-4107279.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/4107280/pexels-photo-4107280.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/4107281/pexels-photo-4107281.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 58900,
        originalPrice: 65900,
        rating: 4.8,
        reviews: 892,
        stock: 8,
        brand: "Dyson",
        description: "Dyson's most powerful, intelligent cordless vacuum. Laser reveals invisible dust. Scientifically proven deep clean with up to 60 minutes of run time.",
        specifications: {
            "Suction Power": "230 AW",
            "Run Time": "Up to 60 minutes",
            "Charge Time": "4.5 hours",
            "Bin Volume": "0.76L",
            "Filtration": "Advanced whole-machine HEPA filtration",
            "Display": "LCD screen shows performance data",
            "Weight": "3.1kg",
            "Attachments": "8 tools included"
        },
        variants: [
            { type: "model", name: "V15 Detect Absolute", available: true },
            { type: "model", name: "V15 Detect Complete", available: true }
        ],
        customerReviews: [
            {
                name: "Pooja Malhotra",
                rating: 5,
                date: "2024-12-13",
                comment: "Worth every rupee! The laser detection is amazing - you can see dust you never knew existed. Powerful suction.",
                verified: true
            },
            {
                name: "Aditya Verma",
                rating: 5,
                date: "2024-12-07",
                comment: "Best vacuum cleaner I've owned. The LCD display is very informative. Battery life is excellent.",
                verified: true
            },
            {
                name: "Kavita Rao",
                rating: 4,
                date: "2024-12-02",
                comment: "Excellent cleaning performance. A bit heavy for extended use but the results are worth it.",
                verified: true
            }
        ],
        delivery: "Free delivery by 29 Dec",
        returnPolicy: "10 days return & exchange"
    },
    {
        id: 6,
        name: "Levi's Men's 511 Slim Fit Jeans",
        category: "Fashion",
        images: [
            "https://images.pexels.com/photos/1082526/pexels-photo-1082526.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1082527/pexels-photo-1082527.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 2999,
        originalPrice: 4999,
        rating: 4.3,
        reviews: 3421,
        stock: 67,
        brand: "Levi's",
        description: "The Levi's 511 Slim Fit Jeans sit below the waist with a slim fit from hip to ankle. Made from premium denim with just the right amount of stretch for all-day comfort.",
        specifications: {
            "Fit": "Slim fit",
            "Rise": "Mid rise",
            "Leg Opening": "14.5 inches",
            "Material": "98% Cotton, 2% Elastane",
            "Closure": "Button fly",
            "Pockets": "5-pocket styling",
            "Care": "Machine washable",
            "Origin": "Made in India"
        },
        variants: [
            { type: "size", name: "30", available: true },
            { type: "size", name: "32", available: true },
            { type: "size", name: "34", available: true },
            { type: "size", name: "36", available: true },
            { type: "color", name: "Dark Blue", available: true },
            { type: "color", name: "Black", available: true },
            { type: "color", name: "Light Blue", available: true }
        ],
        customerReviews: [
            {
                name: "Rohan Khanna",
                rating: 5,
                date: "2024-12-17",
                comment: "Perfect fit and great quality! The stretch makes it very comfortable. True to size.",
                verified: true
            },
            {
                name: "Nikhil Desai",
                rating: 4,
                date: "2024-12-10",
                comment: "Good jeans for the price. Fits well and looks stylish. Denim quality is solid.",
                verified: true
            },
            {
                name: "Manish Agarwal",
                rating: 4,
                date: "2024-12-04",
                comment: "Comfortable and durable. The color hasn't faded after multiple washes. Recommended!",
                verified: true
            }
        ],
        delivery: "Free delivery by 27 Dec",
        returnPolicy: "30 days return & exchange"
    },
    {
        id: 7,
        name: "Canon EOS R6 Mark II Mirrorless Camera",
        category: "Electronics",
        images: [
            "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/90945/pexels-photo-90945.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/90947/pexels-photo-90947.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/90948/pexels-photo-90948.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 229990,
        originalPrice: 249990,
        rating: 4.9,
        reviews: 456,
        stock: 5,
        brand: "Canon",
        description: "Professional full-frame mirrorless camera with 24.2MP sensor, up to 40fps continuous shooting, and advanced autofocus. Perfect for both photography and videography.",
        specifications: {
            "Sensor": "24.2MP Full-Frame CMOS",
            "Processor": "DIGIC X",
            "ISO Range": "100-102400 (expandable to 204800)",
            "Continuous Shooting": "Up to 40fps electronic, 12fps mechanical",
            "Video": "4K 60p, Full HD 180fps",
            "Autofocus": "Dual Pixel CMOS AF II with subject detection",
            "Viewfinder": "3.69m-dot OLED EVF",
            "LCD": "3.0-inch vari-angle touchscreen",
            "Battery Life": "Approx. 760 shots"
        },
        variants: [
            { type: "kit", name: "Body Only", available: true },
            { type: "kit", name: "With 24-105mm Lens", available: true }
        ],
        customerReviews: [
            {
                name: "Abhishek Photographer",
                rating: 5,
                date: "2024-12-15",
                comment: "Incredible camera! The autofocus is lightning fast and accurate. Low-light performance is outstanding.",
                verified: true
            },
            {
                name: "Simran Kaur",
                rating: 5,
                date: "2024-12-08",
                comment: "Perfect for wedding photography. The 40fps burst mode never misses a moment. Battery life is impressive.",
                verified: true
            },
            {
                name: "Varun Cinematographer",
                rating: 5,
                date: "2024-12-01",
                comment: "Best hybrid camera for video and stills. 4K 60p is buttery smooth. Worth the investment!",
                verified: true
            }
        ],
        delivery: "Free delivery by 30 Dec",
        returnPolicy: "7 days return & exchange"
    },
    {
        id: 8,
        name: "Apple MacBook Air M2 13.6-inch",
        category: "Electronics",
        images: [
            "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/18104/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
        ],
        price: 114900,
        originalPrice: 119900,
        rating: 4.8,
        reviews: 6234,
        stock: 18,
        brand: "Apple",
        description: "Supercharged by M2 chip. The redesigned MacBook Air is more portable than ever with a stunning Liquid Retina display. Up to 18 hours of battery life.",
        specifications: {
            "Processor": "Apple M2 chip with 8-core CPU",
            "GPU": "10-core GPU",
            "RAM": "8GB unified memory",
            "Storage": "256GB SSD",
            "Display": "13.6-inch Liquid Retina (2560 x 1664)",
            "Battery": "Up to 18 hours",
            "Ports": "2x Thunderbolt 4, MagSafe 3, 3.5mm headphone jack",
            "Weight": "1.24kg",
            "OS": "macOS Sonoma"
        },
        variants: [
            { type: "color", name: "Midnight", available: true },
            { type: "color", name: "Starlight", available: true },
            { type: "color", name: "Space Grey", available: true },
            { type: "color", name: "Silver", available: true }
        ],
        customerReviews: [
            {
                name: "Shreya Developer",
                rating: 5,
                date: "2024-12-19",
                comment: "Perfect for coding and design work. The M2 chip handles everything smoothly. Battery lasts all day!",
                verified: true
            },
            {
                name: "Akash Student",
                rating: 5,
                date: "2024-12-14",
                comment: "Best laptop for students. Lightweight, powerful, and the display is gorgeous. No fan noise!",
                verified: true
            },
            {
                name: "Nisha Designer",
                rating: 4,
                date: "2024-12-09",
                comment: "Great for creative work. Runs Adobe apps smoothly. Wish it had more ports though.",
                verified: true
            }
        ],
        delivery: "Free delivery by 28 Dec",
        returnPolicy: "10 days return & exchange"
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products };
}
