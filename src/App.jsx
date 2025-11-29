import React, { useState } from 'react';
import { User, X, Printer, Shuffle, Trash2, BusFront, Armchair, ChevronRight, Menu } from 'lucide-react';

const INITIAL_PASSENGERS = [
  "Said Lopez", "Manuel Alcaraz", "Alondra Tapia", "Danna Tapia", "Emiliano", 
  "Vanessa", "Juan Armando Cervantes", "Nardo Cervantes", "Isaac Cervantes", 
  "Fernando Villaseñor", "Darney Vázquez", "Guadalupe Gallegos", "Zamara Cervantes", 
  "Arisbeth Cervantes", "Esteban Muñoz", "Tomas", "Adriana", "Samantha", "Ethan", 
  "Omar", "César", "Jonathan", "Rod", "Joel García", "David", "Leonardo", "Jocelyn", 
  "Nathan Marquez", "Diego De León", "Mireya Leyva", "Josué Blas", "Diana Paola", 
  "Ulises López", "Edgar Martínez", "Perla Carrillo", "Diana Perez", "Fernando Lopez", 
  "Lesly Vaca", "Montserrat Grana", "Fernanda Hernandez", "Ambar Scarleth Martínez", 
  "Carlos Yepez", "Alfonso Cortés", "Diego Renteria", "Maestro Esli Castellanos", "Santi"
];

const TOTAL_SEATS = 46;

const App = () => {
  const [assignments, setAssignments] = useState({});
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const getUnassignedPassengers = () => {
    const assignedNames = Object.values(assignments);
    return INITIAL_PASSENGERS.filter(p => !assignedNames.includes(p));
  };

  const unassignedPassengers = getUnassignedPassengers();

  const handleSeatClick = (seatId) => {
    const occupant = assignments[seatId];
    if (selectedPassenger) {
      if (!occupant || occupant === selectedPassenger) {
        setAssignments(prev => ({ ...prev, [seatId]: selectedPassenger }));
        setSelectedPassenger(null);
      } else {
        // Swap or replace occupant
        setAssignments(prev => ({ ...prev, [seatId]: selectedPassenger }));
        setSelectedPassenger(null);
      }
    } else if (occupant) {
      // Unassign seat
      const newAssignments = { ...assignments };
      delete newAssignments[seatId];
      setAssignments(newAssignments);
      setSelectedPassenger(occupant);
    }
  };

  const handleRandomize = () => {
    if (!window.confirm("Randomize remaining seats?")) return;
    const availableSeats = [];
    for (let i = 1; i <= TOTAL_SEATS; i++) {
      if (!assignments[i]) availableSeats.push(i);
    }
    const toAssign = [...unassignedPassengers];
    const shuffledSeats = availableSeats.sort(() => 0.5 - Math.random());
    const newAssignments = { ...assignments };
    toAssign.forEach((passenger, index) => {
      if (index < shuffledSeats.length) {
        newAssignments[shuffledSeats[index]] = passenger;
      }
    });
    setAssignments(newAssignments);
    setSelectedPassenger(null);
  };

  const handleClear = () => {
    if (window.confirm("Clear all seats?")) {
      setAssignments({});
      setSelectedPassenger(null);
    }
  };

  const renderSeat = (seatNum) => {
    const occupant = assignments[seatNum];
    const isSelectedTarget = selectedPassenger && !occupant;
    
    return (
      <div 
        key={seatNum}
        onClick={() => handleSeatClick(seatNum)}
        className={`
          relative group flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all cursor-pointer h-20 w-16 sm:h-24 sm:w-20
          ${occupant 
            ? 'bg-blue-100 border-blue-300 hover:bg-blue-200' 
            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
          }
          ${isSelectedTarget ? 'ring-2 ring-blue-500 ring-offset-2 animate-pulse' : ''}
        `}
      >
        <div className="absolute top-1 left-2 text-[10px] font-bold text-gray-400">
          {seatNum}
        </div>
        
        {occupant ? (
          <>
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1" />
            <span className="text-[10px] sm:text-xs font-medium text-center leading-tight text-blue-900 w-full overflow-hidden text-ellipsis line-clamp-2">
              {occupant}
            </span>
            <button 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity print:hidden shadow-sm z-10"
                onClick={(e) => {
                   e.stopPropagation();
                   const newA = {...assignments};
                   delete newA[seatNum];
                   setAssignments(newA);
                }}
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <Armchair className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
        )}
      </div>
    );
  };

  const rows = [];
  let seatCounter = 1;
  for (let r = 0; r < 11; r++) {
    rows.push(
      <div key={r} className="flex gap-6 sm:gap-12 mb-4">
        <div className="flex gap-2">
          {renderSeat(seatCounter++)}
          {renderSeat(seatCounter++)}
        </div>
        <div className="flex gap-2">
          {renderSeat(seatCounter++)}
          {renderSeat(seatCounter++)}
        </div>
      </div>
    );
  }
  // Last row
  rows.push(
    <div key="last" className="flex gap-6 sm:gap-12 mb-4">
      <div className="flex gap-2">
        {renderSeat(seatCounter++)}
        {renderSeat(seatCounter++)}
      </div>
      <div className="flex gap-2 w-[80px] sm:w-[176px]" /> 
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
            <Menu size={20} />
          </button>
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
            <BusFront size={20} />
          </div>
          <h1 className="text-lg font-bold hidden sm:block">Bus Manager</h1>
          <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
            <span className="font-semibold text-blue-700">{Object.keys(assignments).length}</span>
            <span className="text-gray-500">/ {TOTAL_SEATS} seated</span>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
           <button 
            onClick={handleRandomize}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
            title="Auto-fill remaining seats"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">Auto-Fill</span>
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Clear all seats"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative print:block print:overflow-visible">
        
        {/* Sidebar */}
        <aside 
          className={`
            absolute lg:relative z-10 h-full bg-white border-r w-80 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out
            print:hidden
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'}
          `}
        >
          <div className="flex flex-col h-full lg:w-80"> 
            <div className="p-4 border-b bg-gray-50/50">
              <h2 className="font-semibold text-gray-700 flex justify-between items-center">
                Waitlist
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {unassignedPassengers.length}
                </span>
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
               {unassignedPassengers.length === 0 ? (
                <div className="text-center py-12 text-gray-400 px-6">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <User className="opacity-20" />
                  </div>
                  <p className="text-sm">List is empty.</p>
                  <p className="text-xs mt-1">Everyone has a seat!</p>
                </div>
              ) : (
                unassignedPassengers.map((p) => (
                  <div 
                    key={p}
                    onClick={() => {
                        setSelectedPassenger(selectedPassenger === p ? null : p);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`
                      p-3 rounded-lg border text-sm cursor-pointer transition-all flex items-center justify-between group
                      ${selectedPassenger === p 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="font-medium truncate mr-2">{p}</span>
                    {selectedPassenger === p ? (
                        <ChevronRight size={16} className="animate-pulse" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-blue-300" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Restore Button */}
        {!isSidebarOpen && (
             <div className="hidden lg:block absolute top-4 left-4 z-20">
                 <button 
                    onClick={() => setSidebarOpen(true)}
                    className="bg-white p-2 rounded-full shadow-md border hover:bg-gray-50 text-gray-600"
                 >
                    <ChevronRight size={20} />
                 </button>
             </div>
        )}

        {/* Main Bus Area */}
        <main 
            className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100/50 relative w-full print:overflow-visible"
            onClick={() => {
                if (window.innerWidth < 1024 && isSidebarOpen) setSidebarOpen(false);
            }}
        >
          <div className="min-h-full p-4 sm:p-8 flex justify-center pb-32 print:p-0 print:pb-0">
            
            {/* Bus Graphic */}
            <div className="bg-white rounded-[40px] shadow-xl border border-gray-200 p-4 sm:p-8 inline-block print:shadow-none print:border-none">
                <div className="h-16 mb-6 border-b-2 border-dashed border-gray-200 flex justify-between items-center px-4 opacity-50">
                    <span className="text-xs font-bold tracking-[0.3em] text-gray-400">FRONT</span>
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-6 h-1 bg-gray-300 rotate-45 rounded-full" />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    {rows}
                </div>

                <div className="h-10 mt-4 border-t-2 border-dashed border-gray-200 flex justify-center items-center opacity-50">
                    <span className="text-xs font-bold tracking-[0.3em] text-gray-400">REAR</span>
                </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer Indicator */}
      {selectedPassenger && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-auto max-w-[90%] print:hidden">
          <div className="bg-gray-900 text-white pl-4 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Placing</span>
                <span className="font-semibold text-sm truncate max-w-[150px]">{selectedPassenger}</span>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <span className="text-xs text-gray-300 hidden sm:block">Click any empty seat</span>
            <button 
              onClick={() => setSelectedPassenger(null)}
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;