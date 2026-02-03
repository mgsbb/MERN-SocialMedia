import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../../pages/Home';

// ============================================================================================
// Component
// ============================================================================================

const FilterBox = ({ showFilterBox, closeFilter }: any) => {
    const [searchTitle, setSearchTitle] = useState('');
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [sort, setSort] = useState('az');
    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;
    const navigate = useNavigate();

    const query = useQuery();
    const userId = query.get('userId');

    // ------------------------------------------------------------------------------------------

    const filter = (
        e: React.SubmitEvent<HTMLFormElement>,
        sortOnChange: boolean,
    ) => {
        e.preventDefault();
        if (!token) {
            navigate('/');
            closeFilter();
        } else {
            // sortOnChange when select option is changed - else sort when form submitted
            if (sortOnChange) {
                navigate(
                    `/home?search=${searchTitle}&searchTags=${searchTags}&sort=${sortOnChange}&userId=${userId}`,
                );
            } else {
                navigate(
                    `/home?search=${searchTitle}&searchTags=${searchTags}&sort=${sort}&userId=${userId}`,
                );
            }
        }
    };
    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------
    return (
        <div className={`search-box ${showFilterBox ? '' : 'search-box-hide'}`}>
            {/* Close button */}
            <button className='search-box-close btn' onClick={closeFilter}>
                X
            </button>

            {/* Search input field */}
            <form onSubmit={(e) => filter(e, true)}>
                <div className='input-group input-group-flex'>
                    <input
                        type='text'
                        className='input search-input'
                        placeholder='search by title or description'
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                    <input
                        type='text'
                        className='input search-input'
                        placeholder='search by tags - comma separated'
                        value={searchTags}
                        onChange={(e) =>
                            setSearchTags(e.target.value.trim().split(','))
                        }
                    />
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            // filter(e, e.target.value);
                        }}
                        name='sort'
                        id='sort'
                        className='input search-input-select'
                    >
                        <option className='search-input-option' value='az'>
                            A-Z
                        </option>
                        <option className='search-input-option' value='za'>
                            Z-A
                        </option>
                        <option className='search-input-option' value='latest'>
                            Latest
                        </option>
                        <option className='search-input-option' value='oldest'>
                            Oldest
                        </option>
                    </select>
                </div>

                {/* Search go button */}
                <button className='btn go-button'>Go</button>
            </form>
        </div>
    );
};

// ============================================================================================

export default FilterBox;
