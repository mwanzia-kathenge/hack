import React, { useEffect, useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import Image from 'next/image';
import { BsFillBookmarkFill } from 'react-icons/bs';
import Papa from 'papaparse';
import JobsCard from './JobsCard';

export default function Intro() {
  const [search, setSearch] = useState(''); // Search input state
  const [jobData, setJobData] = useState([]); // Store job data from CSV
  const [filteredJobs, setFilteredJobs] = useState([]); // Store filtered jobs
  const [doneSearch, setDoneSearch] = useState(false); // Flag to show search results

  // Fetch the CSV file on component mount and parse it
  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('/skill_groups.csv'); // Fetch from public folder
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true, // Use the first row as headers
          skipEmptyLines: true, // Ignore empty lines
          complete: (results) => setJobData(results.data), // Store CSV data in state
          error: (error) => console.error('CSV Parsing Error:', error),
        });
      } catch (error) {
        console.error('Error fetching the CSV file:', error);
      }
    };

    fetchCSV();
  }, []);

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = jobData.filter((job) => {
      const jobCategory = job.job_category || ''; // Adjust based on your CSV keys
      return jobCategory.toUpperCase() === search.toUpperCase().trim();
    });
    setFilteredJobs(filtered);
    setDoneSearch(true); // Show search results
  };

  return (
    <>
      <div className="w-full h-full flex items-center lg:justify-start py-24 justify-center flex-wrap">
        <div className="lg:w-3/6 w-full sm:p-2 h-full my-2 flex items-center justify-center px-4 md:items-start md:justify-start md:p-20 flex-col">
          <h1 className="md:text-6xl text-2xl sm:text-2xl font-extrabold mb-4 text-black">
            To Choose <span className="text-indigo-600">Right Jobs.</span>
          </h1>
          <p className="md:text-lg sm:text-sm text-xs mb-20 text-gray-400">
            Many Peoples are daily searching in this portal, 100 users added job portal!
          </p>
          <div className="bg-white flex-col mb-6 w-full md:px-4 py-4 flex sm:flex-row items-center justify-center">
            <BiSearchAlt className="text-2xl text-indigo-600 mx-2 hidden sm:flex" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Jobs with Job categories like marketing ..."
              className="xs:w-full w-3/4 h-full px-2 bg-gray-200 text-base py-3 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 my-2 sm:my-0 border border-indigo-600 rounded uppercase tracking-widest mx-4 text-white bg-indigo-600 transition-all duration-700 hover:bg-transparent font-semibold text-base hover:text-indigo-600"
            >
              Search
            </button>
          </div>
          <div className="w-full px-2 py-2 flex items-center justify-start flex-wrap">
            <div className="flex items-center justify-center">
              <BsFillBookmarkFill className="text-indigo-600 text-xl mx-2" />
              <h1 className="font-semibold text-lg"></h1>
            </div>
            <div className="flex items-center justify-center px-4 flex-wrap">
              <p className="px-2 text-gray-600"></p>
              <p className="px-2 text-gray-600"></p>
              <p className="px-2 text-gray-600"></p>
            </div>
          </div>
        </div>
        <div className="w-3/6 my-2 h-full bg-gray-200 hidden items-center justify-center flex-col p-20 lg:flex">
          <Image width={600} height={700} src="/intro.png" alt="no-image-found" />
        </div>
      </div>
      {doneSearch && (
        <div className="w-full flex flex-wrap items-center justify-center py-2 px-2">
          {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobsCard job={job} key={job._id} /> // Use the appropriate key for each job
            ))
          ) : (
            <p className="text-sm text-center font-semibold text-red-500">
              Sorry, no such category job available right now
            </p>
          )}
        </div>
      )}
    </>
  );
}
