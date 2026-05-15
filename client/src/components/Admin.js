import React, { useEffect, useState } from "react";

function Admin() {
  // EMPLOYEES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [birthday, setBirthday] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [users, setUsers] = useState([]);

  // GROUPS
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  // FETCH GROUPS
  const fetchGroups = async () => {
    const res = await fetch("http://localhost:5000/api/groups");
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  // CREATE EMPLOYEE
  const createEmployee = async () => {
    await fetch("http://localhost:5000/api/users/create-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        department,
        designation,
        birthday,
        joiningDate,
      }),
    });

    fetchUsers();

    setFirstName("");
    setLastName("");
    setEmail("");
    setDepartment("");
    setDesignation("");
    setBirthday("");
    setJoiningDate("");
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  // EDIT EMPLOYEE
  const editEmployee = async (user) => {
    const firstName = prompt("First Name", user.firstName);
    const lastName = prompt("Last Name", user.lastName);
    const email = prompt("Email", user.email);
    const department = prompt("Department", user.department);
    const designation = prompt("Designation", user.designation);
    const birthday = prompt("Birthday", user.birthday);
    const joiningDate = prompt("Joining Date", user.joiningDate);

    if (!firstName || !lastName || !email) return;

    await fetch(`http://localhost:5000/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        department,
        designation,
        birthday,
        joiningDate,
      }),
    });

    fetchUsers();
  };

  // CREATE GROUP
  const createGroup = async () => {
    if (!groupName.trim()) return;

    await fetch("http://localhost:5000/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: groupName,
      }),
    });

    setGroupName("");

    fetchGroups();
  };

  // DELETE GROUP
  const deleteGroup = async (id) => {
    await fetch(`http://localhost:5000/api/groups/${id}`, {
      method: "DELETE",
    });

    fetchGroups();
  };

  // ADD MULTIPLE MEMBERS
  const addMember = async () => {
    if (!selectedGroup || selectedUsers.length === 0) return;

    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          fetch(
            `http://localhost:5000/api/groups/${selectedGroup}/add-member`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
              }),
            }
          )
        )
      );

      fetchGroups();

      setSelectedUsers([]);
    } catch (err) {
      console.log(err);
    }
  };

  // REMOVE MEMBER
  const removeMember = async (groupId, userId) => {
    await fetch(
      `http://localhost:5000/api/groups/${groupId}/remove-member`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );

    fetchGroups();
  };

  return (
    <div
      style={{
        width: "450px",
        background: "#f5f3ef",
        padding: "20px",
        overflowY: "auto",
        borderLeft: "1px solid #ddd",
      }}
    >
      <h2>HR Admin Panel</h2>

      {/* CREATE EMPLOYEE */}
      <h3>Create Employee</h3>

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <input
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      />

      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />

      <input
        type="date"
        value={joiningDate}
        onChange={(e) => setJoiningDate(e.target.value)}
      />

      <button onClick={createEmployee}>
        Create Employee
      </button>

      {/* EMPLOYEES */}
      <h3>Employees</h3>

      {users.map((u) => (
        <div
          key={u._id}
          style={{
            background: "white",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <div>
            <b>Name:</b> {u.firstName} {u.lastName}
          </div>

          <div>
            <b>Email:</b> {u.email}
          </div>

          <div>
            <b>Department:</b> {u.department}
          </div>

          <div>
            <b>Designation:</b> {u.designation}
          </div>

          <button onClick={() => editEmployee(u)}>
            Edit
          </button>

          <button onClick={() => deleteEmployee(u._id)}>
            Delete
          </button>
        </div>
      ))}

      {/* CREATE GROUP */}
      <h3>Create Group</h3>

      <input
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <button onClick={createGroup}>
        Create Group
      </button>

      {/* GROUPS */}
      <h3>Groups</h3>

      {groups.map((g) => (
        <div
          key={g._id}
          style={{
            background: "white",
            margin: 10,
            padding: 10,
            borderRadius: "6px",
          }}
        >
          <div>
            <b>{g.name}</b>
          </div>

          <div style={{ marginTop: "5px" }}>
            {g.members?.length || 0} members
          </div>

          <button onClick={() => deleteGroup(g._id)}>
            Delete Group
          </button>

          <div style={{ marginTop: "10px" }}>
            <b>Members:</b>
          </div>

          {g.members?.map((m) => (
            <div
              key={m._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
                background: "#f3f3f3",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              <span>
                {m.firstName} {m.lastName}
              </span>

              <button
                onClick={() => removeMember(g._id, m._id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 8px",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* ADD MEMBERS */}
      <h3>Add Members</h3>

      <select
        onChange={(e) => setSelectedGroup(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <option value="">Select Group</option>

        {groups.map((g) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      <div style={{ marginBottom: "5px" }}>
        Hold CTRL to select multiple users
      </div>

      <select
        multiple
        value={selectedUsers}
        onChange={(e) => {
          const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );

          setSelectedUsers(values);
        }}
        style={{
          height: "150px",
          width: "100%",
          padding: "10px",
        }}
      >
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      <button
        onClick={addMember}
        style={{
          marginTop: "10px",
          width: "100%",
        }}
      >
        Add Selected Members
      </button>
    </div>
  );
}

export default Admin;