import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Experience from './components/Experience/Experience'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'
import Chatbot from './components/Chatbot/Chatbot'
// Blog — not live yet, will push later:
// import BlogList from './components/Blog/BlogList'
// import BlogPost from './components/Blog/BlogPost'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Blog — not live yet, will push later:
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            */}
          </Routes>
        </main>
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}

export default App
