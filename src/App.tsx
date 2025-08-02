import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={
            <main className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  AfriKoin
                </h1>
                <p className="text-muted-foreground text-lg">
                  FinTech & Social Platform for Africa
                </p>
              </div>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App